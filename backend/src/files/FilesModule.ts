import {Module} from "@nestjs/common";
import {FilesController} from "./FilesController";
import {FilesRepository} from "./FilesRepository";
import {FilesService} from "./FilesService";
import {ServiceNodeTemporaryFilesRepository} from "./ServiceNodeTemporaryFilesRepository";
import {ServiceNodeApiClientModule} from "../service-node-api";
import {AccountsModule} from "../accounts";
import {Web3Module} from "../web3";

@Module({
    controllers: [FilesController],
    providers: [FilesRepository, FilesService, ServiceNodeTemporaryFilesRepository],
    imports: [ServiceNodeApiClientModule, AccountsModule, Web3Module],
    exports: [FilesService]
})
export class FilesModule {}
