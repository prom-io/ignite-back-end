import {Injectable, Inject} from "@nestjs/common";
import {AxiosInstance, AxiosPromise} from "axios";
import {SetPasswordHashRequest} from "./types/request";
import {GetPasswordHashResponse} from "./types/response";

@Injectable()
export class PasswordHashApiClient {
    constructor(@Inject("passwordHashApiAxiosInstance") private readonly axios: AxiosInstance) {
    }

    public setPasswordHash(setPasswordHashRequest: SetPasswordHashRequest): AxiosPromise<void> {
        return this.axios.post("/password/hash/change", setPasswordHashRequest);
    }

    public setBinancePasswordHash(setPasswordHashRequest: SetPasswordHashRequest): AxiosPromise<void> {
        return this.axios.post("/password/hash/change-binance", setPasswordHashRequest);
    }

    public getPasswordHashByAddress(address: string): AxiosPromise<GetPasswordHashResponse> {
        return this.axios.get(`/password/hash/${address}`);
    }

    public async getPasswordHashByTransaction(transactionHash: string): Promise<GetPasswordHashResponse> {
        try {
            const data = (await this.getPasswordHashByEthereumMainNetTransaction(transactionHash)).data;

            if (data.hash && data.hash.length) {
                return data;
            } else {
                throw new Error("Empty transaction data, trying to request data from Binance Chain");
            }
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
