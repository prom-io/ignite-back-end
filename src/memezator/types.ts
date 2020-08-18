import { StatusLike, Status } from "../statuses/entities";

export interface LikeAndVotingPower {
  like: StatusLike;
  votingPower: number;
}

export interface MemeWithLikesAndVotingPowers {
  meme: Status;
  likesWithVotingPowers: LikeAndVotingPower[];
}
export interface WinnerMemesWithLikes {
  firstPlace?: MemeWithLikesAndVotingPowers | null;
  secondPlace?: MemeWithLikesAndVotingPowers | null;
  thirdPlace?: MemeWithLikesAndVotingPowers | null;
}
