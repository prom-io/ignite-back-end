import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {LoggerModule} from "./logging";
import {Web3Module} from "./web3";
import {BCryptModule} from "./bcrypt";
import {AuthModule} from "./jwt-auth";
import {config} from "./config";
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

@Module({
    imports: [
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
        TypeOrmModule.forRoot({
            type: "postgres",
            database: config.DATABASE_NAME,
            host: config.DATABASE_HOST,
            port: config.DATABASE_PORT,
            username: config.DATABASE_USERNAME,
            password: config.DATABASE_PASSWORD,
            logging: false,
            entities,
            subscribers,
            synchronize: config.RECREATE_DATABASE_SCHEMA
        })
    ]
})
export class AppModule {}
