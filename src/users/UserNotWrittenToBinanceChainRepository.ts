import {EntityRepository, Repository} from "typeorm";
import {UserNotWrittenToBinanceChain} from "./entities";

@EntityRepository(UserNotWrittenToBinanceChain)
export class UserNotWrittenToBinanceChainRepository extends Repository<UserNotWrittenToBinanceChain> {

}
