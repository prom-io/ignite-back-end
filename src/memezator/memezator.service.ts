import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Cron } from "nest-schedule";
import { getCronExpressionForMemezatorCompetitionSumminUpCron, delay } from "./utils";
import { StatusesRepository } from "../statuses/StatusesRepository";
import _ from "lodash"
import { EtherscanService } from "../etherscan";
import { StatusLikesRepository } from "../statuses/StatusLikesRepository";
import { WinnerMemesWithLikes, MemeWithLikesAndVotingPowers, LikeAndVotingPowerAndReward } from "./types";
import {config} from "../config";
import * as dateFns from "date-fns"
import { LoggerService } from "nest-logger";
import { MemezatorRewardForPlaces } from "../config/types/MemezatorReward";
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

@Injectable()
export class MemezatorService {
  constructor(
    private readonly statusesRepository: StatusesRepository,
    private readonly etherscanService: EtherscanService,
    private readonly statusLikeRepository: StatusLikesRepository,
    private readonly logger: LoggerService,
    private readonly usersRepository: UsersRepository,
    private readonly statusesService: StatusesService,
    private readonly memezatorContestResultRepository: MemezatorContestResultRepository,
    private readonly transactionsRepository: TransactionsRepository
  ) {}

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

    const rewardForCurrentCompetition = config.additionalConfig.memezator.rewards[formattedCompetitionStartDate]
    if (!rewardForCurrentCompetition) {
      throw new InternalServerErrorException(`Not found memezator reward for ${formattedCompetitionStartDate}`)
    }

    const winners = await this.calculateWinnersWithLikesAndRewards(
      rewardForCurrentCompetition,
      competitionStartDate,
      competitionEndDate,
      options.dryRun ? false : true
    )

    if (!options.dryRun) {
      await this.createStatusesAboutWinners(winners, rewardForCurrentCompetition, competitionStartDate)

      const memezatorContestResult = await this.memezatorContestResultRepository.save({
        id: uuid(),
        createdAt: new Date(),
        updatedAt: null,
        result: winners,
      })

      await this.createTransactions(winners, memezatorContestResult.id)
    }

    return winners
  }

  async calculateWinnersWithLikesAndRewards(
    memezatorRewardForPlaces: MemezatorRewardForPlaces,
    competitionStartDate: Date,
    competitionEndDate: Date,
    saveVotesOfMemeInDB: boolean
  ): Promise<WinnerMemesWithLikes> {
    // Memes created after last greenwich midnight
    const memes = await this.statusesRepository.findContainingMemeHashTagAndCreatedAtBetween(competitionStartDate, competitionEndDate)

    let firstPlace: MemeWithLikesAndVotingPowers | null = null
    let secondPlace: MemeWithLikesAndVotingPowers | null = null
    let thirdPlace: MemeWithLikesAndVotingPowers | null = null

    for (const meme of memes) {
      const likes = await this.statusLikeRepository.findByStatus(meme)
      const likesWithVotingPowersAndRewards: LikeAndVotingPowerAndReward[] = []
      let votes = 0

      for (const like of likes) {
        const userBalance = await this.etherscanService.getERC20TokenAccountBalanceForTokenContractAddress(
          config.PROM_TOKENS_CONTRACT_ADDRESS,
          like.user.ethereumAddress
        )
        const votingPower = this.calculateVotingPower(userBalance)

        likesWithVotingPowersAndRewards.push({ like, votingPower, reward: null })

        votes += votingPower
        await delay(1000)
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
      firstPlace.rewardForAuthor = memezatorRewardForPlaces.firstPlace.author
      firstPlace.likesWithVotingPowersAndRewards.forEach((likeWithVotingPowerAndReward) => {
        likeWithVotingPowerAndReward.reward =
          (likeWithVotingPowerAndReward.votingPower / firstPlace.meme.favoritesCount) * memezatorRewardForPlaces.firstPlace.voters
      })
      firstPlace.threeLikesWithVotingPowersAndRewardsWithBiggestRewards =
        _.take(_.sortBy(firstPlace.likesWithVotingPowersAndRewards, likeWithVotingPowerAndReward => -likeWithVotingPowerAndReward.reward), 3)
    }

    if (secondPlace) {
      secondPlace.rewardForAuthor = memezatorRewardForPlaces.secondPlace.author
      secondPlace.likesWithVotingPowersAndRewards.forEach((likeWithVotingPowerAndReward) => {
        likeWithVotingPowerAndReward.reward =
          (likeWithVotingPowerAndReward.votingPower / secondPlace.meme.favoritesCount) * memezatorRewardForPlaces.secondPlace.voters
      })
      secondPlace.threeLikesWithVotingPowersAndRewardsWithBiggestRewards =
        _.take(_.sortBy(secondPlace.likesWithVotingPowersAndRewards, likeWithVotingPowerAndReward => -likeWithVotingPowerAndReward.reward), 3)
    }

    if (thirdPlace) {
      thirdPlace.rewardForAuthor = memezatorRewardForPlaces.thirdPlace.author
      thirdPlace.likesWithVotingPowersAndRewards.forEach((likeWithVotingPowerAndReward) => {
        likeWithVotingPowerAndReward.reward =
          (likeWithVotingPowerAndReward.votingPower / thirdPlace.meme.favoritesCount) * memezatorRewardForPlaces.thirdPlace.voters
      })
      thirdPlace.threeLikesWithVotingPowersAndRewardsWithBiggestRewards =
        _.take(_.sortBy(thirdPlace.likesWithVotingPowersAndRewards, likeWithVotingPowerAndReward => -likeWithVotingPowerAndReward.reward), 3)
    }

    return {
      firstPlace,
      secondPlace,
      thirdPlace
    }
  }

  /**
   * Copied from MemezatorService because of circular dep issue 
   * TODO: Fix that issue and use MemezatorService
   */
  calculateVotingPower(balance: string): number {
    const promTokens = new Big(this.formatBalanceToPromTokens(balance))
    if (promTokens.lt(2)) {
        return 1
    } else if (promTokens.lt(5)) {
        return 40
    } else {
        return 80
    }
  }

  formatBalanceToPromTokens(balance: string): string {
      return new Big(balance).div("1000000000000000000").toFixed(2)
  }

  getLastMidnightInGreenwich(): Date {
    const midnightInGreenwich = new Date()
    midnightInGreenwich.setUTCHours(0, 0, 0, 0)

    return midnightInGreenwich
  }

  private async createStatusesAboutWinners(
    winners: WinnerMemesWithLikes,
    rewardForCurrentCompetition: MemezatorRewardForPlaces,
    competitionStartDate: Date
  ) {
    const memezatorOfficialAccount = await this.usersRepository.findByEthereumAddress(config.ADDRESS_OF_MEMEZATOR_OFFICIAL)

    if (winners.firstPlace) {
      await this.createStatusAboutWinner(
        memezatorOfficialAccount,
        winners,
        rewardForCurrentCompetition,
        competitionStartDate,
        "firstPlace"
      )
    }

    if (winners.secondPlace) {
      await this.createStatusAboutWinner(
        memezatorOfficialAccount,
        winners,
        rewardForCurrentCompetition,
        competitionStartDate,
        "secondPlace"
      )
    }

    if (winners.thirdPlace) {
      await this.createStatusAboutWinner(
        memezatorOfficialAccount,
        winners,
        rewardForCurrentCompetition,
        competitionStartDate,
        "thirdPlace"
      )
    }
  }

  private async createStatusAboutWinner(
    memezatorOfficialAccount: User,
    winnerMemesWithLikes: WinnerMemesWithLikes,
    memezatorRewardForPlaces: MemezatorRewardForPlaces,
    competitionStartDate: Date,
    place: "firstPlace" | "secondPlace" | "thirdPlace"
  ) {
    const threeWinnerVoters = winnerMemesWithLikes[place].threeLikesWithVotingPowersAndRewardsWithBiggestRewards

    const placeNumber = ({ firstPlace: 1, secondPlace: 2, thirdPlace: 3 })[place]

    let statusText =
      `**MEME №${placeNumber} OF ${dateFns.format(competitionStartDate, "yyyy/MM/dd")}**\n` +
      `Voted: **${winnerMemesWithLikes[place].meme.favoritesCount}** votes\n` +
      `Prize: **${memezatorRewardForPlaces[place].author + memezatorRewardForPlaces[place].voters}** PROM\n` +
      `\n\n  ` +
      `Author: ${this.getMarkdownLinkForUser(winnerMemesWithLikes[place].meme.author)} ${winnerMemesWithLikes[place].rewardForAuthor} PROM\n`
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
        referredStatusId: winnerMemesWithLikes[place].meme.id,
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

    const transactionsObjects = inputsForTransactionsCreation.map(inputForTransactionsCreation => ({
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
    }))

    return await this.transactionsRepository.save(transactionsObjects)
  }

  private getMarkdownLinkForUser(user: User): string {
    return `[${user.displayedName}](${user.username || user.ethereumAddress})`
  }
}
