import {Injectable} from "@nestjs/common";
import {Cron, NestSchedule} from "nest-schedule";
import {UsersNotWrittenToBinanceChainRepository} from "./UsersNotWrittenToBinanceChainRepository";
import {UsersRepository} from "./UsersRepository";

@Injectable()
export class BinanceChainSynchronizer extends NestSchedule {
    constructor(private readonly usersNotWrittenToBinanceChainRepository: UsersNotWrittenToBinanceChainRepository,
                private readonly usersRepository: UsersRepository) {
        super();
    }

    @Cron("*/30 * * * *")
    public async synchronizeUserWithBinanceChain(): Promise<void> {
        const users = await this.usersNotWrittenToBinanceChainRepository.findAll();

        for (const userNotWrittenToBinanceChain of users) {
            try {
                // Save user to Binance chain - this API is not ready yet
                // This api will require user ethereum address, password hash and private key:
                // const address = userNotWrittenToBinanceChain.user.ethereumAddress;
                // const passwordHash = userNotWrittenToBinanceChain.user.privateKey; // this is actually password hash
                // const privateKey = userNotWrittenToBinanceChain.privateKey // and this is a private key
                // const response = await this.someBinanceChainApiClient.setPasswordHash(address, privateKey, passwordHash);
                // const retrievedHash = response.data.someFieldWithHash;
                // API will return transaction hash, so we'll save it:
                // userNotWrittenToBinanceChain.user.binanceChainTransactionHash = retrievedHash;
                // Save user to database
                // await this.usersRepository.save(userNotWrittenToBinanceChain.user);
                // Delete object from database
                // await this.usersNotWrittenToBinanceChainRepository.delete(userNotWrittenToBinanceChain);
            } catch (error) {

            }
        }
    }
}
