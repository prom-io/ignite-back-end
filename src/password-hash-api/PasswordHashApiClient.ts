import {Injectable, Inject} from "@nestjs/common";
import {AxiosInstance, AxiosPromise} from "axios";
import {SetPasswordHashRequest} from "./types/request";
import {GetPasswordHashResponse} from "./types/response";

@Injectable()
export class PasswordHashApiClient {
    constructor(@Inject("passwordHashApiAxiosInstance") private readonly axios: AxiosInstance) {
    }

    public setPasswordHash(setPasswordHashRequest: SetPasswordHashRequest): AxiosPromise<void> {
        return this.axios.post("/password/hash/set", setPasswordHashRequest);
    }

    public getPasswordHashByAddress(address: string): AxiosPromise<GetPasswordHashResponse> {
        return this.axios.get(`/password/hash/${address}`);
    }

    public async getPasswordHashByTransaction(transactionHash: string): Promise<GetPasswordHashResponse> {
        try {
            return (await this.getPasswordHashByEthereumMainNetTransaction(transactionHash)).data;
        } catch (error) {
            console.log(error);
            return (await this.getPasswordHashByBinanceChainTransaction(transactionHash)).data;
        }
    }

    public getPasswordHashByBinanceChainTransaction(transactionHash: string): AxiosPromise<GetPasswordHashResponse> {
        return this.axios.get(`/password/binance-smart-chain/${transactionHash}`);
    }

    public getPasswordHashByEthereumMainNetTransaction(transactionHash: string): AxiosPromise<GetPasswordHashResponse> {
        return this.axios.get(`/password/mainnet/${transactionHash}`);
    }
}
