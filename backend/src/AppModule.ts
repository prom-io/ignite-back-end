import {Module} from "@nestjs/common";
import {LoggerModule} from "./logging";
import {NedbModule} from "./nedb";
import {FilesModule} from "./files";
import {AccountsModule} from "./accounts";
import {EncryptorServiceClient} from "./encryptor";

@Module({
    imports: [
        LoggerModule,
        NedbModule,
        FilesModule,
        AccountsModule,
        EncryptorServiceClient
    ]
})
export class AppModule {}
