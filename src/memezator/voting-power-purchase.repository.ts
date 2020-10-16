import { User } from './../users/entities/User';
import { Repository, EntityRepository, MoreThanOrEqual } from "typeorm";
import { VotingPowerPurchase } from "./entities/VotingPowerPurchase";
import { getCurrentMemezatorContestStartTime } from "./utils";
import { Moment } from 'moment';

@EntityRepository(VotingPowerPurchase)
export class VotingPowerPurchaseRepository extends Repository<
VotingPowerPurchase
> {
    public async calculateCurrentVotingPowerPurchaseForUser(
        userId: string,
    ): Promise<number> {
        const memezatorContestStartTime = getCurrentMemezatorContestStartTime();
        const userVotingPowerForLastDay = await this.createQueryBuilder(
            "voting_power_purchase",
        )
            .select(`SUM(voting_power_purchase."votingPower")`, "sum")
            .where(
                'voting_power_purchase."txnDate" >= :memezatorContestStartTime',
                { memezatorContestStartTime },
            )
            .andWhere(`voting_power_purchase."userId" = :userId`, { userId })
            .getRawOne();

        if (userVotingPowerForLastDay.sum) {
            return userVotingPowerForLastDay.sum;
        } else {
            return 0;
        }
    }

    public async getAllUsedPromosesByToday(): Promise<number> {
        const memezatorContestStartTime = getCurrentMemezatorContestStartTime();
        const totalPromos = await this.createQueryBuilder("voting_power_purchase")
            .select(`SUM(voting_power_purchase."txnSum")`, "sum")
            .where(
                'voting_power_purchase."txnDate" >= :memezatorContestStartTime',
                { memezatorContestStartTime },
            )
            .getRawOne()
        if (!totalPromos.sum) {
            return 0;
        }
        return totalPromos.sum;
    }
}
