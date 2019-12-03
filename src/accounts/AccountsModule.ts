import {Module} from "@nestjs/common";
import {AccountsController} from "./AccountsController";
import {AccountsService} from "./AccountsService";
import {AccountsRepository} from "./AccountsRepository";
import {ServiceNodeApiClientModule} from "../service-node-api";

@Module({
    controllers: [AccountsController],
    providers: [AccountsService, AccountsRepository],
    imports: [ServiceNodeApiClientModule]
})
export class AccountsModule {}
