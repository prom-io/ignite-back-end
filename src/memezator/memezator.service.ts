import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Cron, NestSchedule } from "nest-schedule";
import { getCronExpressionForMemezatorCompetitionSumminUpCron } from "./utils";
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
    let competitionStartDate = new Date()
    if (options.startedInCron) {
      competitionStartDate = dateFns.sub(competitionStartDate, { hours: 1 })
    }
    competitionStartDate.setHours(0, 0, 0, 0)

    const competitionEndDate = new Date()

    if (options.startedInCron) {
      competitionEndDate.setHours(0, 0, 0, 0)
    }

    const formattedCompetitionStartDate = dateFns.format(competitionStartDate, "yyyy.MM.dd")

    const rewardPool = config.additionalConfig.memezator.rewardPoolsByDate[formattedCompetitionStartDate]
    if (!rewardPool) {
      throw new InternalServerErrorException(`Not found memezator reward for ${formattedCompetitionStartDate}`)
    }

    const winners = await this.calculateWinnersWithLikesAndRewards(
      rewardPool,
      competitionStartDate,
      competitionEndDate,
      options.dryRun ? false : true
    )

    if (!options.dryRun) {
      await this.createStatusesAboutWinners(winners, rewardPool, competitionStartDate)

      const memezatorContestResult = await this.memezatorContestResultRepository.save({
        id: uuid(),
        createdAt: new Date(),
        updatedAt: null,
        result: winners,
      })

      const transactions = await this.createTransactions(winners, memezatorContestResult.id)
      await this.transactionsService.performTransactions(transactions).catch(err => {
        this.logger.error(err)
      })
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

    let firstPlace: MemeWithLikesAndVotingPowers | null = null
    let secondPlace: MemeWithLikesAndVotingPowers | null = null
    let thirdPlace: MemeWithLikesAndVotingPowers | null = null

    for (const meme of memes) {
      const likes = await this.statusLikeRepository.findByStatus(meme)
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
        firstPlace = memeWithLikesAndVotingPowers
      } else if (!secondPlace || votes > secondPlace.meme.favoritesCount) {
        secondPlace = memeWithLikesAndVotingPowers
      } else if (!thirdPlace || votes > thirdPlace.meme.favoritesCount) {
        thirdPlace = memeWithLikesAndVotingPowers
      }
    }

    if (firstPlace) {
      this.calculateAndAssignRewardsToVoters(firstPlace, rewardPool, {
        rewardFractionForAuthor: 0.10,
        rewardFractionToEqualyShareBetweenEveryVoter: 0.12,
        rewardFractionToEqualyShareBetweenEvery2ndRandomVoter: 0.18,
        rewardFractionToEqualyShareBetweenEvery4thRandomVoter: 0.138,
        rewardFractionToEqualyShareBetweenEvery20thRandomVoter: 0.09,
        rewardFractionFor1stRandomVoter: 0.03,
        rewardFractionFor2ndRandomVoter: 0.024,
        rewardFractionFor3rdRandomVoter: 0.018,
      })
    }

    if (secondPlace) {
      this.calculateAndAssignRewardsToVoters(secondPlace, rewardPool, {
        rewardFractionForAuthor: 0.06,
        rewardFractionToEqualyShareBetweenEveryVoter: 0.02,
        rewardFractionToEqualyShareBetweenEvery2ndRandomVoter: 0.03,
        rewardFractionToEqualyShareBetweenEvery4thRandomVoter: 0.023,
        rewardFractionToEqualyShareBetweenEvery20thRandomVoter: 0.015,
        rewardFractionFor1stRandomVoter: 0.005,
        rewardFractionFor2ndRandomVoter: 0.004,
        rewardFractionFor3rdRandomVoter: 0.003,
      })
    }

    if (thirdPlace) {
      this.calculateAndAssignRewardsToVoters(thirdPlace, rewardPool, {
        rewardFractionForAuthor: 0.04,
        rewardFractionToEqualyShareBetweenEveryVoter: 0.02,
        rewardFractionToEqualyShareBetweenEvery2ndRandomVoter: 0.03,
        rewardFractionToEqualyShareBetweenEvery4thRandomVoter: 0.023,
        rewardFractionToEqualyShareBetweenEvery20thRandomVoter: 0.015,
        rewardFractionFor1stRandomVoter: 0.005,
        rewardFractionFor2ndRandomVoter: 0.004,
        rewardFractionFor3rdRandomVoter: 0.003,
      })
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

  getLastMidnightInGreenwich(): Date {
    const midnightInGreenwich = new Date()
    midnightInGreenwich.setUTCHours(0, 0, 0, 0)

    return midnightInGreenwich
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
    const rewardForEveryVoter =
      (rewardPool * rewardFractions.rewardFractionToEqualyShareBetweenEveryVoter) /
        memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards.length;

    // In these 3 sets in the below forEach we will insert indexes
    // of some randomly selected voters.
    const indexesOfEvery2ndRandomVoter = new Set<number>()
    const indexesOfEvery4thRandomVoter = new Set<number>()
    const indexesOfEvery20thRandomVoter = new Set<number>()

    memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards.forEach((likeWithVotingPowerAndReward, i) => {
      // then we assign the calculated reward that every voter should get
      likeWithVotingPowerAndReward.reward = rewardForEveryVoter

      // and by the way randomly select some voters, we will
      // use them below for further calculations.
      // Here we randomly take every 2nd, every 4th and very 20the voter.
      // Note that one voter may be selected at most once, thats why we use "else if",
      // in other words the intersection of those 3 sets is empty ;)
      if (Math.random() > 0.5) {
        indexesOfEvery2ndRandomVoter.add(i)
      } else if (Math.random() > 0.75) {
        indexesOfEvery4thRandomVoter.add(i)
      } else if (Math.random() > 0.95) {
        indexesOfEvery20thRandomVoter.add(i)
      }
    })

    /**
     * Calculate the reward that every n-th voter should get
     */
    const rewardForEvery2ndRandomVoter = 
      (rewardPool * rewardFractions.rewardFractionToEqualyShareBetweenEvery2ndRandomVoter) / indexesOfEvery2ndRandomVoter.size;
    const rewardForEvery4thRandomVoter =
      (rewardPool * rewardFractions.rewardFractionToEqualyShareBetweenEvery4thRandomVoter) / indexesOfEvery4thRandomVoter.size;
    const rewardForEvery20thRandomVoter =
      (rewardPool * rewardFractions.rewardFractionToEqualyShareBetweenEvery20thRandomVoter) / indexesOfEvery20thRandomVoter.size;

    /**
     * Give every n-th voter the reward that they should get
     */
    indexesOfEvery2ndRandomVoter.forEach(index => {
      memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards[index].reward += rewardForEvery2ndRandomVoter
    })

    indexesOfEvery4thRandomVoter.forEach(index => {
      memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards[index].reward += rewardForEvery4thRandomVoter
    })

    indexesOfEvery20thRandomVoter.forEach(index => {
      memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards[index].reward += rewardForEvery20thRandomVoter
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
      _.takeRight(
        _.sortBy(memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards, likeWithVotingPowerAndReward => likeWithVotingPowerAndReward.reward),
        3,
      )
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
        competitionStartDate,
        3,
      )
    }

    if (winners.secondPlace) {
      await this.createStatusAboutWinner(
        memezatorOfficialAccount,
        winners.secondPlace,
        rewardPool,
        competitionStartDate,
        2,
      )
    }

    if (winners.firstPlace) {
      await this.createStatusAboutWinner(
        memezatorOfficialAccount,
        winners.firstPlace,
        rewardPool,
        competitionStartDate,
        1,
      )
    }
  }

  private async createStatusAboutWinner(
    memezatorOfficialAccount: User,
    memeWithLikesAndVotingPowers: MemeWithLikesAndVotingPowers,
    rewardPool: number,
    competitionStartDate: Date,
    place: 1 | 2 | 3
  ): Promise<void> {
    const threeWinnerVoters = memeWithLikesAndVotingPowers.threeLikesWithVotingPowersAndRewardsWithBiggestRewards

    let statusText =
      `**MEME №${place} OF ${dateFns.format(competitionStartDate, "yyyy/MM/dd")}**\n` +
      `Voted: **${memeWithLikesAndVotingPowers.meme.favoritesCount}** votes\n` +
      `Prize: **${rewardPool}** PROM\n` +
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
          txnSum: _.toString(winners.firstPlace.rewardForAuthor)
        },
        ...winners.firstPlace.likesWithVotingPowersAndRewards.map(likeWithVotingPowerAndReward => ({
          txnTo: likeWithVotingPowerAndReward.like.user.ethereumAddress,
          txnSum: _.toString(likeWithVotingPowerAndReward.reward)
        }))
      )
    }

    if (winners.secondPlace) {
      inputsForTransactionsCreation.push(
        {
          txnTo: winners.secondPlace.meme.author.ethereumAddress,
          txnSum: _.toString(winners.secondPlace.rewardForAuthor)
        },
        ...winners.secondPlace.likesWithVotingPowersAndRewards.map(likeWithVotingPowerAndReward => ({
          txnTo: likeWithVotingPowerAndReward.like.user.ethereumAddress,
          txnSum: _.toString(likeWithVotingPowerAndReward.reward)
        }))
      )
    }

    if (winners.thirdPlace) {
      inputsForTransactionsCreation.push(
        {
          txnTo: winners.thirdPlace.meme.author.ethereumAddress,
          txnSum: _.toString(winners.thirdPlace.rewardForAuthor)
        },
        ...winners.thirdPlace.likesWithVotingPowersAndRewards.map(likeWithVotingPowerAndReward => ({
          txnTo: likeWithVotingPowerAndReward.like.user.ethereumAddress,
          txnSum: _.toString(likeWithVotingPowerAndReward.reward)
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
