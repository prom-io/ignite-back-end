import { Repository, EntityRepository } from "typeorm";
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
                "voting_power_purchase.\"txnDate\" >= :memezatorContestStartTime",
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

    public async getAllUsedPromsByToday(
        memezatorContestStartDateTime: Date,
        memezatorContestEndDateTime: Date,
    ): Promise<string> {
        const totalProms: { sum?: string | null } = await this.createQueryBuilder("voting_power_purchase")
            .select(`SUM(voting_power_purchase."txnSum")`, "sum")
            .where(
                "voting_power_purchase.\"createdAt\" >= :memezatorContestStartDateTime",
                { memezatorContestStartDateTime },
            )
            .andWhere(
                "voting_power_purchase.\"createdAt\" < :memezatorContestEndDateTime",
                { memezatorContestEndDateTime },
            )
            .getRawOne()

        return totalProms.sum || "0";
    }
}
