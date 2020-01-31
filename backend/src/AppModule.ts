import {Module} from "@nestjs/common";
import {LoggerModule} from "./logging";
import {NedbModule} from "./nedb";
import {FilesModule} from "./files";
import {AccountsModule} from "./accounts";
import {TransactionsModule} from "./transactions";
import {DiscoveryModule} from "./discovery";
import {Web3Module} from "./web3";

@Module({
    imports: [
        LoggerModule,
        NedbModule,
        FilesModule,
        AccountsModule,
        TransactionsModule,
        DiscoveryModule,
        Web3Module
    ]
})
export class AppModule {}
