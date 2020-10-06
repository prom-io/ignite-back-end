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
import { setImmediatePromise } from "../utils/sest-intermediate-promise";
import { asyncForEach } from "../utils/async-foreach";
import { uniqueRandoms } from "../utils/unique-randoms";
import { MemezatorContestResult } from "./entities/MemezatorContestResult";
import { VotingPowerPurchaseRepository } from "./voting-power-purchase.repository";

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
    private readonly votingPowerPurchaseRepository: VotingPowerPurchaseRepository
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

  async startMemezatorCompetitionSummingUp(options: {
    startedInCron: boolean,
    dryRun: boolean,
    saveResultsInDryRun?: boolean,
  }): Promise<WinnerMemesWithLikes> {
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
    
    let memezatorContestResult: MemezatorContestResult | null = null

    if (!options.dryRun || options.saveResultsInDryRun) {
      memezatorContestResult = await this.memezatorContestResultRepository.save({
        id: uuid(),
        createdAt: new Date(),
        updatedAt: null,
        result: winners,
      })
    }

    if (!options.dryRun) {
      await this.createStatusesAboutWinners(winners, rewardPool, competitionStartDate.toDate())

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
        const votingPowerPurchase = await this.votingPowerPurchaseRepository.calculateVotingPowerForUser(like.user.id);
        let votingPower: number;
        if (votingPowerPurchase){
          votingPower = this.calculateVotingPower(balance) + votingPowerPurchase;
        } else {
          votingPower = this.calculateVotingPower(balance)
        }
         
        likesWithVotingPowersAndRewards.push({ like, votingPower, reward: null, rewardsDetailed: [] })

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
      await this.calculateAndAssignRewardsToVoters(firstPlace, rewardPool, rewardFractionsForFirstPlace)
    }

    if (secondPlace) {
      await this.calculateAndAssignRewardsToVoters(secondPlace, rewardPool, rewardFractionsForSecondPlace)
    }

    if (thirdPlace) {
      await this.calculateAndAssignRewardsToVoters(thirdPlace, rewardPool, rewardFractionsForThirdsPlace)
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
  private async calculateAndAssignRewardsToVoters(
    memeWithLikesAndVotingPowers: MemeWithLikesAndVotingPowers,
    rewardPool: number,
    rewardFractions: RewardFractions,
  ): Promise<void> {
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
    
    await setImmediatePromise()

    // In these 3 sets in the below forEach we will insert indexes
    // of some randomly selected voters.
    const indexesOfEvery2ndRandomTicket: {[index: number]: number} = {}
    const indexesOfEvery4thRandomTicket: {[index: number]: number} = {}
    const indexesOfEvery20thRandomTicket: {[index: number]: number} = {}

    await asyncForEach(
      memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards,
      async (likeWithVotingPowerAndReward, i) => {
        await setImmediatePromise()

        // then we assign the calculated reward that every voter should get
        const rewardSumForEveryTicket = rewardForEveryTicket * likeWithVotingPowerAndReward.votingPower
        likeWithVotingPowerAndReward.reward = rewardSumForEveryTicket;
        likeWithVotingPowerAndReward.rewardsDetailed.push({
          for: "rewardSumForEveryTicket", reward: rewardSumForEveryTicket
        })

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
      }
    )

    /**
     * Calculate the reward that every n-th voter should get
     */
    const rewardForEvery2ndRandomTicket =
      (rewardPool * rewardFractions.rewardFractionToEqualyShareBetweenEvery2ndRandomVoter) / _.sum(_.values(indexesOfEvery2ndRandomTicket));
    
    await setImmediatePromise()
    
    const rewardForEvery4thRandomTicket =
      (rewardPool * rewardFractions.rewardFractionToEqualyShareBetweenEvery4thRandomVoter) / _.sum(_.values(indexesOfEvery4thRandomTicket));
    
    await setImmediatePromise()

    const rewardForEvery20thRandomTicket =
      (rewardPool * rewardFractions.rewardFractionToEqualyShareBetweenEvery20thRandomVoter) / _.sum(_.values(indexesOfEvery20thRandomTicket));

    await setImmediatePromise()

    /**
     * Give every n-th voter the reward that they should get
     */
    _.forEach(indexesOfEvery2ndRandomTicket, (howManyTimesGetsRewardForEvery2ndRandomTicket, index) => {
      const rewardSumForEvery2ndRandomTicket = howManyTimesGetsRewardForEvery2ndRandomTicket * rewardForEvery2ndRandomTicket
      memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards[+index].reward += rewardSumForEvery2ndRandomTicket
      memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards[+index].rewardsDetailed.push({
        for: "rewardSumForEvery2ndRandomTicket", reward: rewardSumForEvery2ndRandomTicket
      })
    })

    await setImmediatePromise()

    _.forEach(indexesOfEvery4thRandomTicket, (howManyTimesGetsRewardForEvery4thRandomTicket, index) => {
      const rewardSumForEvery4thRandomTicket = howManyTimesGetsRewardForEvery4thRandomTicket * rewardForEvery4thRandomTicket
      memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards[+index].reward += rewardSumForEvery4thRandomTicket
      memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards[+index].rewardsDetailed.push({
        for: "rewardSumForEvery4thRandomTicket", reward: rewardSumForEvery4thRandomTicket
      })
    })

    await setImmediatePromise()

    _.forEach(indexesOfEvery20thRandomTicket, (howManyTimesGetsRewardForEvery20thRandomTicket, index) => {
      const rewardSumForEvery20thRandomTicket = howManyTimesGetsRewardForEvery20thRandomTicket * rewardForEvery20thRandomTicket
      memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards[+index].reward += rewardSumForEvery20thRandomTicket 
      memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards[+index].rewardsDetailed.push({
        for: "rewardSumForEvery20thRandomTicket", reward: rewardSumForEvery20thRandomTicket
      })
    })

    await setImmediatePromise()

    /**
     * Now we are giving some rewards to 3 randomly selected voters
     */
    await this.calculateAndAssignRewardsTo3RandomTickets({
      memeWithLikesAndVotingPowers,
      rewardFractions,
      rewardPool,
    })

    memeWithLikesAndVotingPowers.threeLikesWithVotingPowersAndRewardsWithBiggestRewards =
      _(memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards)
        .sortBy(likeWithVotingPowerAndReward => likeWithVotingPowerAndReward.reward)
        .takeRight(3)
        .reverse()
        .value()
  }

  /**
   * Calculates and gives rewards to 3 randomly selected tickets. Read more in docs about memezator algorithm
   * @see https://docs.google.com/document/d/1fAbkRuZBXe6UQUGd-6_q6t8jEc0EfT2g1wKItrBP6iE/edit?usp=sharing
   * look at the 'One/Second/Third random ticket' parts 
   */
  private async calculateAndAssignRewardsTo3RandomTickets(
    { memeWithLikesAndVotingPowers, rewardFractions, rewardPool }: {
      memeWithLikesAndVotingPowers: MemeWithLikesAndVotingPowers,
      rewardFractions: RewardFractions,
      rewardPool: number,
    }
  ): Promise<void> {
    // The indexes (or numbers or offsets) of 3 randomly selected tokens.
    // This array will contain up to 3 elements (not more than 3 elements, but may be less than 3 elements). 
    const threeRandomTicketsIndexes: number[] = _.sortBy(uniqueRandoms(1, memeWithLikesAndVotingPowers.meme.favoritesCount, 3))
    let threeRandomTicketsIndexesProcessedCount = 0;
    let passedTicketsCount = 0;

    for (const likeWithVotingPowerAndRewards of memeWithLikesAndVotingPowers.likesWithVotingPowersAndRewards) {
      await setImmediatePromise();

      // already gave rewards to authors of 3 random tickets, so no need to continue
      if (threeRandomTicketsIndexesProcessedCount >= 3) {
        break;
      }

      // the currently processing ticket from the threeRandomTicketsIndexes array, that we randomly selected above.
      const randomTicketIndex = threeRandomTicketsIndexes[threeRandomTicketsIndexesProcessedCount]

      // check if the currently processing randomly selected ticket was given with this likeWithVotingPowerAndRewards object
      if (
        randomTicketIndex > passedTicketsCount &&
        randomTicketIndex <= passedTicketsCount + likeWithVotingPowerAndRewards.votingPower
      ) {
        // if so, then increment the counter
        threeRandomTicketsIndexesProcessedCount++;

        const rewardFractionForCurrentRandomTicket = ({
          1: rewardFractions.rewardFractionFor1stRandomVoter,
          2: rewardFractions.rewardFractionFor2ndRandomVoter,
          3: rewardFractions.rewardFractionFor3rdRandomVoter,
        })[threeRandomTicketsIndexesProcessedCount]

        const rewardForDetail: "firstRandomTicket" | "secondRandomTicket" | "thirdRandomTicket" = ({
          1: "firstRandomTicket",
          2: "secondRandomTicket",
          3: "thirdRandomTicket",
        })[threeRandomTicketsIndexesProcessedCount];

        const rewardForCurrentRandomTicket = rewardPool * rewardFractionForCurrentRandomTicket;

        likeWithVotingPowerAndRewards.reward += rewardForCurrentRandomTicket;

        likeWithVotingPowerAndRewards.rewardsDetailed.push({
          for: rewardForDetail, reward: rewardForCurrentRandomTicket
        });
      }

      passedTicketsCount += likeWithVotingPowerAndRewards.votingPower;
    }
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
