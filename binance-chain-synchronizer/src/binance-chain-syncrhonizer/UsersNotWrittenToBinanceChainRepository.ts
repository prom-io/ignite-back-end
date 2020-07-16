import {EntityRepository, Repository} from "typeorm";
import {UserNotWrittenToBinanceChain} from "./entities/UserNotWrittenToBinanceChain";

@EntityRepository(UserNotWrittenToBinanceChain)
export class UsersNotWrittenToBinanceChainRepository extends Repository<UserNotWrittenToBinanceChain> {
    public findAll(): Promise<UserNotWrittenToBinanceChain[]> {
        return this.find();
    }
}
