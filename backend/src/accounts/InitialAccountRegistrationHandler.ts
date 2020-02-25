import {Injectable, OnApplicationBootstrap} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import {AccountsService} from "./AccountsService";
import {CreateDataValidatorRequest} from "./types/request";
import {Web3Wrapper} from "../web3";
import {config} from "../config";

@Injectable()
export class InitialAccountRegistrationHandler implements OnApplicationBootstrap {
    constructor(private readonly accountsService: AccountsService,
                private readonly web3Wrapper: Web3Wrapper,
                private readonly log: LoggerService) {
    }

    public async onApplicationBootstrap(): Promise<void> {
        this.log.info("Checking if node has registered accounts");
        if ((await this.accountsService.getAllAccounts()).length === 0 && config.INITIAL_ACCOUNT_PRIVATE_KEY) {
            this.log.info("Registering initial account");
            const account = this.web3Wrapper.generateAccountFromPrivateKey(config.INITIAL_ACCOUNT_PRIVATE_KEY);
            const createDataValidatorRequest = new CreateDataValidatorRequest(
                account.address,
                config.INITIAL_ACCOUNT_PRIVATE_KEY,
                account.address
            );
            await this.accountsService.createDataValidatorAccount(createDataValidatorRequest);
            this.log.info(`Created initial account with ${account.address} address`);
        }
    }
}
