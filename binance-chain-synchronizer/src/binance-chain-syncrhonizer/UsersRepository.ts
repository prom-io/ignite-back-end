import {EntityRepository, Repository} from "typeorm";
import {User} from "./entities";

export class UsersRepository extends Repository<User> {
    public findByBinanceChainTransactionHashIsNull(): Promise<User[]> {
        return this.find({
            where: {
                binanceChainTransactionHash: null
            }
        })
    }
}
