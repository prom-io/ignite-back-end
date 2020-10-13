import { Repository, EntityRepository, MoreThanOrEqual } from "typeorm";
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

        return userVotingPowerForLastDay;
    }
}
