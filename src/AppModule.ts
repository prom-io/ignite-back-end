import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {LoggerModule} from "./logging";
import {Web3Module} from "./web3";
import {BCryptModule} from "./bcrypt";
import {AuthModule} from "./jwt-auth";
import {StatusesModule} from "./statuses";
import {UserSubscriptionsModule} from "./user-subscriptions";
import {UsersModule} from "./users";
import {entities} from "./typeorm-entities";
import {subscribers} from "./typeorm-subscribers";
import {MicrobloggingBlockchainApiModule} from "./microblogging-blockchain-api";
import {MediaAttachmentsModule} from "./media-attachments";
import {SkynetModule} from "./skynet";
import {BtfsModule} from "./btfs-sync";
import {DefaultAccountProviderModule} from "./default-account-provider/DefaultAccountProviderModule";
import {WalletGeneratorModule} from "./wallet-generator";
import {PasswordHashApiModule} from "./password-hash-api";
import {PasswordHashGeneratorModule} from "./passsword-hash-generator";
import {StatisticsModule} from "./statistics";
import {ValidationModule} from "./utils/validation";
import {MemezatorModule} from "./memezator/memezator.module";
import { StatisticsLogService } from "./statistics-log/statistics-log.service";
import { StatisticsLogModule } from "./statistics-log/statistics-log.module";

@Module({
    imports: [
        StatisticsLogModule,
        LoggerModule,
        DefaultAccountProviderModule,
        Web3Module,
        BCryptModule,
        AuthModule,
        UsersModule,
        StatusesModule,
        UserSubscriptionsModule,
        MicrobloggingBlockchainApiModule,
        MediaAttachmentsModule,
        SkynetModule,
        BtfsModule,
        WalletGeneratorModule,
        PasswordHashApiModule,
        PasswordHashGeneratorModule,
        StatisticsModule,
        ValidationModule,
        MemezatorModule,
        TypeOrmModule.forRoot(
            {
                ...require("../ormconfig.js"),
                entities,
                subscribers,
            }
        )
    ]
})
export class AppModule {

}
