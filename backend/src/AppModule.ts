import {Module} from "@nestjs/common";
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
        AuthModule
    ]
})
export class AppModule {}
