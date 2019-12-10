import {Module} from "@nestjs/common";
import {FilesController} from "./FilesController";
import {FilesRepository} from "./FilesRepository";
import {FilesService} from "./FilesService";
import {ServiceNodeApiClientModule} from "../service-node-api";
import {AccountsModule} from "../accounts";

@Module({
    controllers: [FilesController],
    providers: [FilesRepository, FilesService],
    imports: [ServiceNodeApiClientModule, AccountsModule],
    exports: [FilesService]
})
export class FilesModule {}
