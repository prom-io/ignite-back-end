import {Module} from "@nestjs/common";
import {BinanceChainSynchronizer} from "./BinanceChainSynchronizer";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersRepository} from "./UsersRepository";
import {UsersNotWrittenToBinanceChainRepository} from "./UsersNotWrittenToBinanceChainRepository";

@Module({
    providers: [BinanceChainSynchronizer],
    imports: [
        TypeOrmModule.forFeature([
            UsersRepository,
            UsersNotWrittenToBinanceChainRepository
        ])
    ]
})
export class BinanceChainSynchronizerModule {

}
