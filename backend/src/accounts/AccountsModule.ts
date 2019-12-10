import {Module} from "@nestjs/common";
import {AccountsController} from "./AccountsController";
import {AccountsService} from "./AccountsService";
import {AccountsRepository} from "./AccountsRepository";
import {DataOwnersService} from "./DataOwnersService";
import {DataOwnersRepository} from "./DataOwnersRepository";
import {ServiceNodeApiClientModule} from "../service-node-api";

@Module({
    controllers: [AccountsController],
    providers: [AccountsService, AccountsRepository, DataOwnersService, DataOwnersRepository],
    imports: [ServiceNodeApiClientModule],
    exports: [DataOwnersService, DataOwnersRepository]
})
export class AccountsModule {}
