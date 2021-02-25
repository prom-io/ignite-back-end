import { Reward } from './entities/Reward';
import { EntityRepository, Repository } from "typeorm";


@EntityRepository(Reward)
export class RewardRepository extends Repository<Reward> { }