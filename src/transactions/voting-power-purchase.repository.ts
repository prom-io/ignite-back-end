import { Repository, EntityRepository } from "typeorm";
import { VotingPowerPurchase } from "./entities/VotingPowerPurchase";

@EntityRepository(VotingPowerPurchase)
export class VotingPowerPurchaseRepository extends Repository<VotingPowerPurchase> {}