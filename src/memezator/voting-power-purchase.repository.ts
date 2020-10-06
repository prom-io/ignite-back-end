import { Repository, EntityRepository, MoreThan } from "typeorm";
import { VotingPowerPurchase } from "./entities/VotingPowerPurchase";

@EntityRepository(VotingPowerPurchase)
export class VotingPowerPurchaseRepository extends Repository<VotingPowerPurchase> {

public async calculateVotingPowerForUser(userId: string){
    const currentDate = new Date();
    const lastDayDate = currentDate.getTime() - 24*60*60*1000;
    const purchasesForLastDay = await this.find({where: {createdAt: MoreThan(lastDayDate)}})
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const userVotingPowerForLastDay = purchasesForLastDay.map(purchase => purchase.votingPower).reduce(reducer);
    return userVotingPowerForLastDay;
    }
}