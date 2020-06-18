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

    public getPasswordHashByTransaction(transactionHash: string): AxiosPromise<GetPasswordHashResponse> {
        return this.axios.get(`/password/${transactionHash}`);
    }
}
