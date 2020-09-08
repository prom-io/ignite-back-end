import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Cron, NestSchedule } from "nest-schedule";
import { getCronExpressionForMemezatorCompetitionSumminUpCron, getCurrentMemezatorContestStartTime } from "./utils";
import { StatusesRepository } from "../statuses/StatusesRepository";
import _ from "lodash"
import { StatusLikesRepository } from "../statuses/StatusLikesRepository";
import { WinnerMemesWithLikes, MemeWithLikesAndVotingPowers, LikeAndVotingPowerAndReward, RewardFractions } from "./types";
import {config} from "../config";
import * as dateFns from "date-fns"
import { LoggerService } from "nest-logger";
import { UsersRepository } from "../users";
import { StatusesService } from "../statuses";
import { User } from "../users/entities";
import { Big } from "big.js";
import { StatusReferenceType } from "../statuses/entities";
import { MemezatorContestResultRepository } from "./memezator-contest-result.repository";
import uuid from "uuid";
import { Transaction } from "../transactions/entities/Transaction";
import { TransactionsRepository } from "../transactions/TransactionsRepository";
import { TransactionStatus } from "../transactions/types/TransactionStatus.enum";
import { TransactionSubject } from "../transactions/types/TransactionSubject.enum";
import { TokenExchangeService } from "../token-exchange";
import { TransactionsService } from "../transactions/transactions.service";
import {
  rewardFractionsForFirstPlace,
  rewardFractionsForSecondPlace,
  rewardFractionsForThirdsPlace,
  overallRewardFractionForFirstPlace,
  overallRewardFractionForSecondPlace,
  overallRewardFractionForThirdPlace
} from "./constants";
import momentTZ from "moment-timezone"

@Injectable()
export class MemezatorService extends NestSchedule {
  constructor(
    private readonly statusesRepository: StatusesRepository,
    private readonly statusLikeRepository: StatusLikesRepository,
    private readonly logger: LoggerService,
    private readonly usersRepository: UsersRepository,
    private readonly statusesService: StatusesService,
    private readonly memezatorContestResultRepository: MemezatorContestResultRepository,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly tokenExchangeService: TokenExchangeService,
    private readonly transactionsService: TransactionsService,
  ) {
    super()
  }

  @Cron(getCronExpressionForMemezatorCompetitionSumminUpCron())
  async memezatorCompetitionSummingUpCron(): Promise<void> {
    if (!config.additionalConfig.memezator.disableCompetitionSummingUpCron) {
      this.logger.log("Memezator competition summing up cron job started")
      await this.startMemezatorCompetitionSummingUp({ startedInCron: true, dryRun: false })
      this.logger.log("Memezator competition summing up cron job finished")
    } else {
      this.logger.warn("Memezator competition summing up cron job is disabled")
    }
  }

  async startMemezatorCompetitionSummingUp(options: {startedInCron: boolean, dryRun: boolean}): Promise<WinnerMemesWithLikes> {
    let competitionEndDate: momentTZ.Moment;
    let competitionStartDate: momentTZ.Moment;

    if (options.startedInCron) {
      competitionEndDate = getCurrentMemezatorContestStartTime()
      competitionStartDate = competitionEndDate.clone().subtract({ day: 1 })
    } else {
      competitionStartDate = getCurrentMemezatorContestStartTime()
      competitionEndDate = momentTZ()
    }

    this.logger.info(`startMemezatorCompetitionSummingUp: ${JSON.stringify({competitionStartDate, competitionEndDate})}`)

    const formattedCompetitionStartDate = competitionStartDate.format("YYYY.MM.DD")

    const rewardPool = config.additionalConfig.memezator.rewardPoolsByDate[formattedCompetitionStartDate]

    if (!rewardPool) {
      throw new InternalServerErrorException(`Not found memezator reward for ${formattedCompetitionStartDate}`)
    }

    this.logger.info(`Reward pool for ${formattedCompetitionStartDate} (${competitionStartDate.format()}) is ${rewardPool}`)

    const winners = await this.calculateWinnersWithLikesAndRewards(
      rewardPool,
      competitionStartDate.toDate(),
      competitionEndDate.toDate(),
      options.dryRun ? false : true
    )

    if (!options.dryRun) {
      await this.createStatusesAboutWinners(winners, rewardPool, competitionStartDate.toDate())

      const memezatorContestResult = await this.memezatorContestResultRepository.save({
        id: uuid(),
        createdAt: new Date(),
        updatedAt: null,
        result: winners,
      })

      const transactions = await this.createTransactions(winners, memezatorContestResult.id)

      if (config.additionalConfig.memezator.performTransactions) {
        this.logger.info(`startMemezatorCompetitionSummingUp: started to perform transactions`)
        await this.transactionsService.performTransactions(transactions).catch(err => {
          this.logger.error(err)
        })
        this.logger.info(`startMemezatorCompetitionSummingUp: finished to perform transactions`)
      } else {
        this.logger.info(`startMemezatorCompetitionSummingUp: transactions performing is disabled`)
      }
      
    }

    return winners
  }

  async calculateWinnersWithLikesAndRewards(
    rewardPool: number,
    competitionStartDate: Date,
    competitionEndDate: Date,
    saveVotesOfMemeInDB: boolean
  ): Promise<WinnerMemesWithLikes> {
    // Memes created after last greenwich midnight
    const memes = await this.statusesRepository.findContainingMemeHashTagAndCreatedAtBetween(competitionStartDate, competitionEndDate)

    this.logger.info(`calculateWinnersWithLikesAndRewards: found ${memes.length} memes created between ${competitionStartDate.toISOString()} and ${competitionEndDate.toISOString()}`)
    this.logger.info(`calculateWinnersWithLikesAndRewards: IDs of memes: ${JSON.stringify(memes.map(meme => meme.id))}`)

    let firstPlace: MemeWithLikesAndVotingPowers | null = null
    let secondPlace: MemeWithLikesAndVotingPowers | null = null
    let thirdPlace: MemeWithLikesAndVotingPowers | null = null

    for (const meme of memes) {
      const likes = await this.statusLikeRepository.findByStatus(meme)
      this.logger.info(`calculateWinnersWithLikesAndRewards: for meme ${meme.id} found those likes: ${JSON.stringify(likes.map(like => like.id))}`)

      const likesWithVotingPowersAndRewards: LikeAndVotingPowerAndReward[] = []
      let votes = 0

      for (const like of likes) {
        const balance = await this.tokenExchangeService.getBalanceInProms(like.user.ethereumAddress)
        const votingPower = this.calculateVotingPower(balance)

        likesWithVotingPowersAndRewards.push({ like, votingPower, reward: null })

        votes += votingPower
      }

      const memeWithLikesAndVotingPowers: MemeWithLikesAndVotingPowers = {
        meme,
        likesWithVotingPowersAndRewards,
        rewardForAuthor: null,
        threeLikesWithVotingPowersAndRewardsWithBiggestRewards: null
      }

      meme.favoritesCount = votes

      if (saveVotesOfMemeInDB) {
        await this.statusesRepository.save(meme)        
      }

      if (!firstPlace || votes > firstPlace.meme.favoritesCount) {
        thirdPlace = secondPlace
        secondPlace = firstPlace
        firstPlace = memeWithLikesAndVotingPowers
      } else if (!secondPlace || votes > secondPlace.meme.favoritesCount) {
        thirdPlace = secondPlace
        secondPlace = memeWithLikesAndVotingPowers
      } else if (!thirdPlace || votes > thirdPlace.meme.favoritesCount) {
        thirdPlace = memeWithLikesAndVotingPowers
      }
    }

    if (firstPlace) {
      this.calculateAndAssignRewardsToVoters(firstPlace, rewardPool, rewardFractionsForFirstPlace)
    }

    if (secondPlace) {
      this.calculateAndAssignRewardsToVoters(secondPlace, rewardPool, rewardFractionsForSecondPlace)
    }

    if (thirdPlace) {
      this.calculateAndAssignRewardsToVoters(thirdPlace, rewardPool, rewardFractionsForThirdsPlace)
    }

    return {
      firstPlace,
      secondPlace,
      thirdPlace
    }
  }

  calculateVotingPower(balance: string): number {
    const promTokens = new Big(balance)
    if (promTokens.lt(2)) {
        return 1
    } else if (promTokens.lt(5)) {
        return 40
    } else {
        return 80
    }
  }

  /**
   * This algorithm is pretty hard to understand, so i strongly recommend you to read the docs first
   * @see https://docs.google.com/document/d/1fAbkRuZBXe6UQUGd-6_q6t8jEc0EfT2g1wKItrBP6iE/edit?usp=sharing
   * 
   * @param memeWithLikesAndVotingPowers meme for which voters the algorithm should run
   * @param rewardPool the reward pool for todays contest
   * @param rewardFractions 
   */
  private calculateAndAssignRewardsToVoters(
    memeWithLikesAndVotingPowers: MemeWithLikesAndVotingPowers,
    rewardPool: number,
    rewardFractions: RewardFractions,
  ): void {
    // First of all, do the easiest work: calculate the reward for meme author
    memeWithLikesAndVotingPowers.rewardForAuthor = rewardPool * rewardFractions.rewardFractionForAuthor

    // Here goes the hard part - calculating rewards for voters

    // Calculate the reward that every voter should get
    const rewardForEveryTicket =
      (rewardPool * rewardFractions.rewardFractionToEqualyShareBetweenEveryVoter) /
        _.sumBy(
          memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards,
          likesWithVotingPowersAndRewards => likesWithVotingPowersAndRewards.votingPower
        );

    // In these 3 sets in the below forEach we will insert indexes
    // of some randomly selected voters.
    const indexesOfEvery2ndRandomTicket: {[index: number]: number} = {}
    const indexesOfEvery4thRandomTicket: {[index: number]: number} = {}
    const indexesOfEvery20thRandomTicket: {[index: number]: number} = {}

    memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards.forEach((likeWithVotingPowerAndReward, i) => {
      // then we assign the calculated reward that every voter should get
      likeWithVotingPowerAndReward.reward = rewardForEveryTicket * likeWithVotingPowerAndReward.votingPower

      // and by the way randomly select some voters, we will
      // use them below for further calculations.
      // Here we randomly take every 2nd, every 4th and very 20the voter.
      // Note that one voter may be selected at most once, thats why we use "else if",
      // in other words the intersection of those 3 sets is empty ;)
      _.times(likeWithVotingPowerAndReward.votingPower, () => {
        if (Math.random() > 0.5) {
          if (indexesOfEvery2ndRandomTicket[i]) {
            indexesOfEvery2ndRandomTicket[i]++
          } else {
            indexesOfEvery2ndRandomTicket[i] = 1
          }
        } else if (Math.random() > 0.75) {
          if (indexesOfEvery4thRandomTicket[i]) {
            indexesOfEvery4thRandomTicket[i]++
          } else {
            indexesOfEvery4thRandomTicket[i] = 1
          }
        } else if (Math.random() > 0.95) {
          if (indexesOfEvery20thRandomTicket[i]) {
            indexesOfEvery20thRandomTicket[i]++
          } else {
            indexesOfEvery20thRandomTicket[i] = 1
          }
        }
      })
    })

    /**
     * Calculate the reward that every n-th voter should get
     */
    const rewardForEvery2ndRandomTicket =
      (rewardPool * rewardFractions.rewardFractionToEqualyShareBetweenEvery2ndRandomVoter) / _.sum(_.values(indexesOfEvery2ndRandomTicket));
    const rewardForEvery4thRandomTicket =
      (rewardPool * rewardFractions.rewardFractionToEqualyShareBetweenEvery4thRandomVoter) / _.sum(_.values(indexesOfEvery4thRandomTicket));
    const rewardForEvery20thRandomTicket =
      (rewardPool * rewardFractions.rewardFractionToEqualyShareBetweenEvery20thRandomVoter) / _.sum(_.values(indexesOfEvery20thRandomTicket));

    /**
     * Give every n-th voter the reward that they should get
     */
    _.forEach(indexesOfEvery2ndRandomTicket, (howManyTimesGetsRewardForEvery2ndRandomTicket, index) => {
      memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards[+index].reward +=
        howManyTimesGetsRewardForEvery2ndRandomTicket * rewardForEvery2ndRandomTicket
    })

    _.forEach(indexesOfEvery4thRandomTicket, (howManyTimesGetsRewardForEvery4thRandomTicket, index) => {
      memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards[+index].reward +=
        howManyTimesGetsRewardForEvery4thRandomTicket * rewardForEvery4thRandomTicket
    })

    _.forEach(indexesOfEvery20thRandomTicket, (howManyTimesGetsRewardForEvery20thRandomTicket, index) => {
      memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards[+index].reward +=
      howManyTimesGetsRewardForEvery20thRandomTicket * rewardForEvery20thRandomTicket
    })

    /**
     * Now we are giving some rewards to 3 randomly selected voters
     */
    const threeRandomTickets = _.sampleSize(memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards, 3)

    if (threeRandomTickets[0]) { 
      threeRandomTickets[0].reward += rewardPool * rewardFractions.rewardFractionFor1stRandomVoter;
    }
    if (threeRandomTickets[1]) { 
      threeRandomTickets[1].reward += rewardPool * rewardFractions.rewardFractionFor2ndRandomVoter;
    }
    if (threeRandomTickets[2]) { 
      threeRandomTickets[2].reward += rewardPool * rewardFractions.rewardFractionFor3rdRandomVoter;
    }

    memeWithLikesAndVotingPowers.threeLikesWithVotingPowersAndRewardsWithBiggestRewards =
      _(memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards)
        .sortBy(likeWithVotingPowerAndReward => likeWithVotingPowerAndReward.reward)
        .takeRight(3)
        .reverse()
        .value()
  }

  private async createStatusesAboutWinners(
    winners: WinnerMemesWithLikes,
    rewardPool: number,
    competitionStartDate: Date,
  ): Promise<void> {
    const memezatorOfficialAccount = await this.usersRepository.findByEthereumAddress(config.ADDRESS_OF_MEMEZATOR_OFFICIAL)

    if (winners.thirdPlace) {
      await this.createStatusAboutWinner(
        memezatorOfficialAccount,
        winners.thirdPlace,
        rewardPool,
        overallRewardFractionForThirdPlace,
        competitionStartDate,
        3,
      )
    }

    if (winners.secondPlace) {
      await this.createStatusAboutWinner(
        memezatorOfficialAccount,
        winners.secondPlace,
        rewardPool,
        overallRewardFractionForSecondPlace,
        competitionStartDate,
        2,
      )
    }

    if (winners.firstPlace) {
      await this.createStatusAboutWinner(
        memezatorOfficialAccount,
        winners.firstPlace,
        rewardPool,
        overallRewardFractionForFirstPlace,
        competitionStartDate,
        1,
      )
    }
  }

  private async createStatusAboutWinner(
    memezatorOfficialAccount: User,
    memeWithLikesAndVotingPowers: MemeWithLikesAndVotingPowers,
    rewardPool: number,
    overallRewardFraction: number,
    competitionStartDate: Date,
    place: 1 | 2 | 3
  ): Promise<void> {
    const threeWinnerVoters = memeWithLikesAndVotingPowers.threeLikesWithVotingPowersAndRewardsWithBiggestRewards

    let statusText =
      `**MEME №${place} OF ${dateFns.format(competitionStartDate, "yyyy/MM/dd")}**\n` +
      `Voted: **${memeWithLikesAndVotingPowers.meme.favoritesCount}** votes\n` +
      `Prize: **${new Big(rewardPool * overallRewardFraction).toFixed(2)}** PROM\n` +
      `\n  ` +
      `Author: ${this.getMarkdownLinkForUser(memeWithLikesAndVotingPowers.meme.author)} ${new Big(memeWithLikesAndVotingPowers.rewardForAuthor).toFixed(2)} PROM\n`

    if (threeWinnerVoters[0]) {
      statusText += `Winner №1: **${new Big(threeWinnerVoters[0].reward).toFixed(2)}** PROM ${this.getMarkdownLinkForUser(threeWinnerVoters[0].like.user)} (${threeWinnerVoters[0].votingPower} votes)\n`
    }

    if (threeWinnerVoters[1]) {
      statusText += `Winner №2: **${new Big(threeWinnerVoters[1].reward).toFixed(2)}** PROM ${this.getMarkdownLinkForUser(threeWinnerVoters[1].like.user)} (${threeWinnerVoters[1].votingPower} votes)\n`
    }

    if (threeWinnerVoters[2]) {
      statusText += `Winner №3: **${new Big(threeWinnerVoters[2].reward).toFixed(2)}** PROM ${this.getMarkdownLinkForUser(threeWinnerVoters[2].like.user)} (${threeWinnerVoters[2].votingPower} votes)\n`
    }

    await this.statusesService.createStatus({
        status: statusText, 
        referredStatusId: memeWithLikesAndVotingPowers.meme.id,
        statusReferenceType: StatusReferenceType.REPOST,
        mediaAttachments: [],
      },
      memezatorOfficialAccount
    )
  }

  private async createTransactions(winners: WinnerMemesWithLikes, memezatorContestResultId: string): Promise<Transaction[]> {
    const inputsForTransactionsCreation: Array<{txnTo: string, txnSum: string}> = []

    if (winners.firstPlace) {
      inputsForTransactionsCreation.push(
        {
          txnTo: winners.firstPlace.meme.author.ethereumAddress,
          txnSum: new Big(winners.firstPlace.rewardForAuthor).round(18).toString()
        },
        ...winners.firstPlace.likesWithVotingPowersAndRewards.map(likeWithVotingPowerAndReward => ({
          txnTo: likeWithVotingPowerAndReward.like.user.ethereumAddress,
          txnSum: new Big(likeWithVotingPowerAndReward.reward).round(18).toString()
        }))
      )
    }

    if (winners.secondPlace) {
      inputsForTransactionsCreation.push(
        {
          txnTo: winners.secondPlace.meme.author.ethereumAddress,
          txnSum: new Big(winners.secondPlace.rewardForAuthor).round(18).toString()
        },
        ...winners.secondPlace.likesWithVotingPowersAndRewards.map(likeWithVotingPowerAndReward => ({
          txnTo: likeWithVotingPowerAndReward.like.user.ethereumAddress,
          txnSum: new Big(likeWithVotingPowerAndReward.reward).round(18).toString()
        }))
      )
    }

    if (winners.thirdPlace) {
      inputsForTransactionsCreation.push(
        {
          txnTo: winners.thirdPlace.meme.author.ethereumAddress,
          txnSum: new Big(winners.thirdPlace.rewardForAuthor).round(18).toString()
        },
        ...winners.thirdPlace.likesWithVotingPowersAndRewards.map(likeWithVotingPowerAndReward => ({
          txnTo: likeWithVotingPowerAndReward.like.user.ethereumAddress,
          txnSum: new Big(likeWithVotingPowerAndReward.reward).round(18).toString()
        }))
      )
    }

    const transactions: Transaction[] = inputsForTransactionsCreation.map(
      inputForTransactionsCreation => new Transaction({
        id: uuid(),
        createdAt: new Date(),
        txnStatus: TransactionStatus.NOT_STARTED,
        txnSubj: TransactionSubject.REWARD,
        txnFrom: config.MEMEZATOR_PRIZE_FUND_ACCOUNT_ADDRESS,
        txnTo: inputForTransactionsCreation.txnTo,
        txnSum: inputForTransactionsCreation.txnSum,
        txnDetails: {
          memezatorContestResultId
        }
      })
    )

    return await this.transactionsRepository.save(transactions)
  }

  private getMarkdownLinkForUser(user: User): string {
    return `[${user.displayedName}](${user.username || user.ethereumAddress})`
  }
}
