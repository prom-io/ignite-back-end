import { Injectable } from "@nestjs/common";
import { Cron } from "nest-schedule";
import { getCronExpressionForMemezatorCompetitionSumminUpCron, delay } from "./utils";
import { StatusesRepository } from "../statuses/StatusesRepository";
import { HashTagsRepository } from "../statuses/HashTagsRepository";
import _ from "lodash"
import { EtherscanService } from "../etherscan";
import { StatusLikesRepository } from "../statuses/StatusLikesRepository";
import { MEMEZATOR_HASHTAG } from "../common/constants"
import { WinnerMemesWithLikes, MemeWithLikesAndVotingPowers, LikeAndVotingPowerAndReward } from "./types";
import {config} from "../config";
import * as dateFns from "date-fns"
import { LoggerService } from "nest-logger";
import { MemezatorRewardForPlaces } from "src/config/types/MemezatorReward";

@Injectable()
export class MemezatorService {
  constructor(
    private readonly statusesRepository: StatusesRepository,
    private readonly hashTagRepository: HashTagsRepository,
    private readonly etherscanService: EtherscanService,
    private readonly statusLikeRepository: StatusLikesRepository,
    private readonly logger: LoggerService
  ) {}

  @Cron(getCronExpressionForMemezatorCompetitionSumminUpCron())
  async memezatorCompetitionSummingUpCron(): Promise<void> {
    // await this.startMemezatorCompetitionSummingUp(true)
  }
  
  async startMemezatorCompetitionSummingUp(startedInCron: boolean): Promise<WinnerMemesWithLikes> {
    let competitionStartDate = new Date()
    if (startedInCron) {
      competitionStartDate = dateFns.sub(competitionStartDate, { hours: 1 })
    }
    competitionStartDate.setHours(0, 0, 0, 0)

    const competitionEndDate = new Date()

    if (startedInCron) {
      competitionEndDate.setHours(0, 0, 0, 0)
    }

    const formattedCompetitionStartDate = dateFns.format(competitionStartDate, "yyyy.MM.dd")

    const rewardForCurrentCompetition = config.additionalConfig.memezator.rewards[formattedCompetitionStartDate]
    if (!rewardForCurrentCompetition) {
      this.logger.warn(`Not found memezator reward for ${formattedCompetitionStartDate}`)
    }

    const winners = await this.calculateWinnersWithLikesAndRewards(
      rewardForCurrentCompetition,
      competitionStartDate,
      competitionEndDate,
    )

    return winners
  }

  async calculateWinnersWithLikesAndRewards(
    memezatorRewardForPlaces: MemezatorRewardForPlaces,
    competitionStartDate: Date,
    competitionEndDate: Date
  ): Promise<WinnerMemesWithLikes> {
    // Memes created after last greenwich midnight
    const memes = await this.statusesRepository.findContainingMemeHashTagAndCreatedAtBetween(competitionStartDate, competitionEndDate)

    let firstPlace: MemeWithLikesAndVotingPowers | null = null
    let secondPlace: MemeWithLikesAndVotingPowers | null = null
    let thirdPlace: MemeWithLikesAndVotingPowers | null = null

    for (const meme of memes) {
      const likes = await this.statusLikeRepository.findByStatus(meme)
      const likesChunks = _.chunk(likes, 20)
      const likesWithVotingPowersAndRewards: LikeAndVotingPowerAndReward[] = []
      let votes = 0

      for (const likesChunk of likesChunks) {
        const usersBalances = await this.etherscanService.getBalancesOnMultipleAccounts(likesChunk.map(like => like.user.ethereumAddress))
        const votingPowers = usersBalances.map(userBalance => this.calculateVotingPower(userBalance.balance))

        likesWithVotingPowersAndRewards.push(
          ...likesChunk.map((like, i) => ({ like, votingPower: votingPowers[i], reward: null }))
        )

        votes += _.sum(votingPowers)
        await delay(200)
      }

      const memeWithLikesAndVotingPowers: MemeWithLikesAndVotingPowers = {
        meme,
        likesWithVotingPowersAndRewards,
        rewardForAuthor: null,
        threeLikesWithVotingPowersAndRewardsWithBiggestRewards: null
      }

      meme.favoritesCount = votes
      await this.statusesRepository.save(meme)

      if (!firstPlace || votes > firstPlace.meme.favoritesCount) {
        firstPlace = memeWithLikesAndVotingPowers
      } else if (!secondPlace || votes > secondPlace.meme.favoritesCount) {
        secondPlace = memeWithLikesAndVotingPowers
      } else if (!thirdPlace || votes > thirdPlace.meme.favoritesCount) {
        thirdPlace = memeWithLikesAndVotingPowers
      }
    }

    firstPlace.rewardForAuthor = memezatorRewardForPlaces.firstPlace.author
    firstPlace.likesWithVotingPowersAndRewards.forEach((likeWithVotingPowerAndReward) => {
      likeWithVotingPowerAndReward.reward =
        (likeWithVotingPowerAndReward.votingPower / firstPlace.meme.favoritesCount) * memezatorRewardForPlaces.firstPlace.voters
    })
    firstPlace.threeLikesWithVotingPowersAndRewardsWithBiggestRewards =
      _.take(_.sortBy(firstPlace.likesWithVotingPowersAndRewards, "reward"), 3)

    secondPlace.rewardForAuthor = memezatorRewardForPlaces.secondPlace.author
    secondPlace.likesWithVotingPowersAndRewards.forEach((likeWithVotingPowerAndReward) => {
      likeWithVotingPowerAndReward.reward =
        (likeWithVotingPowerAndReward.votingPower / secondPlace.meme.favoritesCount) * memezatorRewardForPlaces.secondPlace.voters
    })
    secondPlace.threeLikesWithVotingPowersAndRewardsWithBiggestRewards =
      _.take(_.sortBy(secondPlace.likesWithVotingPowersAndRewards, "reward"), 3)

    thirdPlace.rewardForAuthor = memezatorRewardForPlaces.thirdPlace.author
    thirdPlace.likesWithVotingPowersAndRewards.forEach((likeWithVotingPowerAndReward) => {
      likeWithVotingPowerAndReward.reward =
        (likeWithVotingPowerAndReward.votingPower / thirdPlace.meme.favoritesCount) * memezatorRewardForPlaces.thirdPlace.voters
    })
    thirdPlace.threeLikesWithVotingPowersAndRewardsWithBiggestRewards =
      _.take(_.sortBy(thirdPlace.likesWithVotingPowersAndRewards, "reward"), 3)

    return {
      firstPlace,
      secondPlace,
      thirdPlace
    }
  }

  calculateVotingPower(balance: string): number {
    if (BigInt(balance) < BigInt(2)) {
      return 1
    } else if (BigInt(balance) < BigInt(5000)) {
      return 40
    } else {
      return 80
    }
  }
}
