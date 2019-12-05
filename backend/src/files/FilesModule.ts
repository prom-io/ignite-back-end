import {Module} from "@nestjs/common";
import {FilesController} from "./FilesController";
import {FilesRepository} from "./FilesRepository";
import {FilesService} from "./FilesService";
import {ServiceNodeApiClientModule} from "../service-node-api";

@Module({
    controllers: [FilesController],
    providers: [FilesRepository, FilesService],
    imports: [ServiceNodeApiClientModule]
})
export class FilesModule {}
