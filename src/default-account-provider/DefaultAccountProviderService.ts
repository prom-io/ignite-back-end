import {Injectable} from "@nestjs/common";
import {Account} from "web3-core";
import {Web3Wrapper} from "../web3";
import {config} from "../config";

@Injectable()
export class DefaultAccountProviderService {
    constructor(private readonly web3Wrapper: Web3Wrapper) {
    }

    public async getDefaultAccount(): Promise<Account> {
        const privateKey = config.INITIAL_ACCOUNT_PRIVATE_KEY;
        return this.web3Wrapper.generateAccountFromPrivateKey(privateKey);
    }
}
