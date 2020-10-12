import { Repository, EntityRepository, MoreThan, MoreThanOrEqual } from "typeorm";
import { VotingPowerPurchase } from "./entities/VotingPowerPurchase";
import { getCurrentMemezatorContestStartTime } from "./utils";

@EntityRepository(VotingPowerPurchase)
export class VotingPowerPurchaseRepository extends Repository<VotingPowerPurchase> {

public async calculateVotingPowerForUser(userId: string){
    const memezatorContestStartTime = getCurrentMemezatorContestStartTime();
    const purchasesForLastDay = await this.find({where: {createdAt: MoreThanOrEqual(memezatorContestStartTime), userId}})
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const userVotingPowerForLastDay = purchasesForLastDay.map(purchase => purchase.votingPower).reduce(reducer);
    return userVotingPowerForLastDay;
    }
}