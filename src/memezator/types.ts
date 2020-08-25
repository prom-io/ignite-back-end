import { StatusLike, Status } from "../statuses/entities";

export interface LikeAndVotingPowerAndReward {
  like: StatusLike;
  votingPower: number;
  reward: number
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
