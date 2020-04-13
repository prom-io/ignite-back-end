import {Module} from "@nestjs/common";
import {FilesController} from "./FilesController";
import {FilesRepository} from "./FilesRepository";
import {FilesService} from "./FilesService";
import {ServiceNodeTemporaryFilesRepository} from "./ServiceNodeTemporaryFilesRepository";
import {ServiceNodeApiClientModule} from "../service-node-api";
import {AccountsModule} from "../accounts/AccountsModule";
import {Web3Module} from "../web3";
import {EncryptorServiceModule} from "../encryptor";

@Module({
    controllers: [FilesController],
    providers: [FilesRepository, FilesService, ServiceNodeTemporaryFilesRepository],
    imports: [ServiceNodeApiClientModule, AccountsModule, Web3Module, EncryptorServiceModule],
    exports: [FilesService]
})
export class FilesModule {}
