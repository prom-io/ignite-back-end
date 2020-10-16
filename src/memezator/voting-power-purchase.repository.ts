import { Repository, EntityRepository, MoreThanOrEqual } from "typeorm";
import { User } from "../users/entities";
import { VotingPowerPurchase } from "./entities/VotingPowerPurchase";
import { getCurrentMemezatorContestStartTime } from "./utils";

@EntityRepository(VotingPowerPurchase)
export class VotingPowerPurchaseRepository extends Repository<
    VotingPowerPurchase
> {
    public async calculateCurrentVotingPowerPurchaseForUser(
        userId: string,
    ): Promise<number> {
        const memezatorContestStartTime = getCurrentMemezatorContestStartTime();
        const votingPower = await this.createQueryBuilder(
            "voting_power_purchase",
        )
            .select(`SUM(voting_power_purchase."votingPower")`, "sum")
            .where(
                'voting_power_purchase."txnDate" >= :memezatorContestStartTime',
                { memezatorContestStartTime },
            )
            .andWhere(`voting_power_purchase."userId" = :userId`, { userId })
            .getRawOne();

        if (votingPower.sum) {
            return votingPower.sum;
        } else {
            return 0;
        }
    }

    async calculatePurchasedVotingPowerForSpecifiedMemezatorContest(
        user: User,
        memezatorContestStartDateTime: Date,
        memezatorContestEndDateTime: Date,
    ): Promise<number> {
        const votingPower = await this.createQueryBuilder(
            "voting_power_purchase",
        )
            .select(`SUM(voting_power_purchase."votingPower")`, "sum")
            .where(
                'voting_power_purchase."txnDate" >= :memezatorContestStartDateTime',
                { memezatorContestStartDateTime },
            )
            .andWhere(
                'voting_power_purchase."txnDate" <= :memezatorContestEndDateTime',
                { memezatorContestEndDateTime },
            )
            .andWhere(`voting_power_purchase."userId" = :userId`, {
                userId: user.id,
            })
            .getRawOne();

        if (votingPower.sum) {
            return votingPower.sum;
        } else {
            return 0;
        }
    }
}
