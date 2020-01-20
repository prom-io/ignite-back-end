import {Module} from "@nestjs/common";
import {LoggerModule} from "./logging";
import {NedbModule} from "./nedb";
import {FilesModule} from "./files";
import {AccountsModule} from "./accounts";
import {TransactionsModule} from "./transactions";
import {DiscoveryModule} from "./discovery";

@Module({
    imports: [
        LoggerModule,
        NedbModule,
        FilesModule,
        AccountsModule,
        TransactionsModule,
        DiscoveryModule
    ]
})
export class AppModule {}
