import {Injectable} from "@nestjs/common";
import Web3 from "web3";
import {EthereumSingature} from "../service-node-api/types/request";

@Injectable()
export class Web3Wrapper {
    constructor(private readonly web3: Web3) {
    }

    public signData(data: object, privateKey: string): EthereumSingature {
        const jsonData = JSON.stringify(data);
        const base64Data = Buffer.from(jsonData).toString("base64");
        const signature = this.web3.eth.accounts.sign(base64Data, privateKey);
        return {
            ...signature,
            messageHash: signature.messageHash!
        }
    }
}
