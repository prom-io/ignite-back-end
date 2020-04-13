import {forwardRef, Module} from "@nestjs/common";
import {AccountsController} from "./AccountsController";
import {AccountsService} from "./AccountsService";
import {AccountsRepository} from "./AccountsRepository";
import {DataOwnersService} from "./DataOwnersService";
import {DataOwnersRepository} from "./DataOwnersRepository";
import {InitialAccountRegistrationHandler} from "./InitialAccountRegistrationHandler";
import {ServiceNodeApiClientModule} from "../service-node-api";
import {Web3Module} from "../web3";
import {UsersModule} from "../users/UsersModule";

@Module({
    controllers: [AccountsController],
    providers: [AccountsService, AccountsRepository, DataOwnersService, DataOwnersRepository, InitialAccountRegistrationHandler],
    imports: [ServiceNodeApiClientModule, Web3Module, UsersModule],
    exports: [DataOwnersService, DataOwnersRepository, AccountsRepository, AccountsService]
})
export class AccountsModule {}
