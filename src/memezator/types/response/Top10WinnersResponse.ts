import { StatusLike } from './../../../statuses/entities/StatusLike';
import { LikeAndVotingPowerAndReward } from '../../types';

export class Top10WinnersResponse {

    top10Winners: StatusLike | StatusLike[];

    reward: number;

    votingPower: number;

    rewardsDetailed: LikeAndVotingPowerAndReward["rewardsDetailed"]

    constructor(object: Top10WinnersResponse){
        Object.assign(this, object)
    }
}
