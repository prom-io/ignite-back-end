import {Injectable} from "@nestjs/common";
import Web3 from "web3";
import {Account} from "web3-core";

@Injectable()
export class Web3Wrapper {
    constructor(private readonly web3: Web3) {
    }

    public generateAccountFromPrivateKey(privateKey: string): Account {
        return this.web3.eth.accounts.privateKeyToAccount(privateKey);
    }
}
