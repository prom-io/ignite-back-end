import { StatusLike, Status } from "../statuses/entities";

export interface LikeAndVotingPowerAndReward {
  like: StatusLike;
  votingPower: number;
  reward: number;
  rewardsDetailed: Array<{
    for: 
      | "rewardSumForEveryTicket"
      | "rewardSumForEvery2ndRandomTicket"
      | "rewardSumForEvery4thRandomTicket"
      | "rewardSumForEvery20thRandomTicket"
      | "firstRandomTicket"
      | "secondRandomTicket"
      | "thirdRandomTicket",
    reward: number,
  }>
}

export interface MemeWithLikesAndVotingPowers {
  meme: Status;
  rewardForAuthor: number;
  likesWithVotingPowersAndRewards: LikeAndVotingPowerAndReward[];
  threeLikesWithVotingPowersAndRewardsWithBiggestRewards: LikeAndVotingPowerAndReward[];
}

export interface WinnerMemesWithLikes {
  firstPlace?: MemeWithLikesAndVotingPowers | null;
  secondPlace?: MemeWithLikesAndVotingPowers | null;
  thirdPlace?: MemeWithLikesAndVotingPowers | null;
}

/**
 * The fractions to calculate rewards for members of memezator contest
 * from daily reward pool.
 * Note that fraction is not the same as percentage.
 * For example:
 * 10% is 0.10 as fraction
 * 3% is 0.03 as fraction
 * 100% is 1.00 as fraction
 * 
 * Here is the documentation following which this structure was created
 * @see https://docs.google.com/document/d/1fAbkRuZBXe6UQUGd-6_q6t8jEc0EfT2g1wKItrBP6iE/edit?usp=sharing
 */
export interface RewardFractions {
  /**
   * How much of the daily reward pool the creator of the winner meme
   * should get as a reward.
   * 
   * For example in docs it is described as follows:
   * Author of TOP 1 meme - 10% of daily reward pool (0.10 as fraction)
   * Author of TOP 2 meme - 6% of daily reward pool (0.06 as fraction)
   * Author of TOP 3 meme - 4% of daily reward pool (0.04 as fraction)
   */
  rewardFractionForAuthor: number,

  /**
   * Example: Every ticket - equal share 12% of daily reward pool
   * (0.12 as fraction)
   */
  rewardFractionToEqualyShareBetweenEveryVoter: number,

  /**
   * Example: Every 2nd ticket (random) - equal share 18% of daily reward pool
   * (0.18 as fraction)
   */
  rewardFractionToEqualyShareBetweenEvery2ndRandomVoter: number,

  /**
   * Example: Every 4th ticket (random) - equal share 13,8% of daily reward pool
   * (0.138 as fraction)
   */
  rewardFractionToEqualyShareBetweenEvery4thRandomVoter: number,

  /**
   * Example: Every 20th ticket (random) - equal share 9% of daily reward pool
   * (0.09 as fraction)
   */
  rewardFractionToEqualyShareBetweenEvery20thRandomVoter: number,

  /**
   * Example: One random ticket - 3% of daily reward pool
   * (0.03 as fraction)
   */
  rewardFractionFor1stRandomVoter: number,

  /**
   * Example: Second random ticket - 2,4% of daily reward pool
   * (0.024 as fraction)
   */
  rewardFractionFor2ndRandomVoter: number,

  /**
   * Example: Third random ticket - 1,8% of daily reward pool
   * (0.018 as fraction)
   */
  rewardFractionFor3rdRandomVoter: number,
}
