import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {LoggerModule} from "./logging";
import {NedbModule} from "./nedb";
import {FilesModule} from "./files";
import {AccountsModule} from "./accounts";
import {TransactionsModule} from "./transactions";
import {DiscoveryModule} from "./discovery";
import {Web3Module} from "./web3";
import {EncryptorServiceModule} from "./encryptor";
import {StatusCheckModule} from "./status-check";
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

@Module({
    imports: [
        LoggerModule,
        NedbModule,
        FilesModule,
        AccountsModule,
        TransactionsModule,
        DiscoveryModule,
        Web3Module,
        EncryptorServiceModule,
        StatusCheckModule,
        BCryptModule,
        AuthModule,
        UsersModule,
        StatusesModule,
        UserSubscriptionsModule,
        MicrobloggingBlockchainApiModule,
        MediaAttachmentsModule,
        TypeOrmModule.forRoot({
            type: "postgres",
            database: config.DATABASE_NAME,
            host: config.DATABASE_HOST,
            port: config.DATABASE_PORT,
            username: config.DATABASE_USERNAME,
            password: config.DATABASE_PASSWORD,
            logging: "all",
            entities,
            subscribers,
            synchronize: config.RECREATE_DATABASE_SCHEMA
        })
    ]
})
export class AppModule {}
