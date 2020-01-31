import {Injectable} from "@nestjs/common";
import Web3 from "web3";
import {Sign} from "web3-core/types";

@Injectable()
export class Web3Wrapper {
    constructor(private readonly web3: Web3) {
    }

    public signData(data: object, privateKey: string): Sign {
        const jsonData = JSON.stringify(data);
        const base64Data = Buffer.from(jsonData).toString("base64");
        return this.web3.eth.accounts.sign(base64Data, privateKey);
    }
}
