import {AxiosPromise} from "axios";
import {axiosInstance} from "../api-client";
import {ACCOUNTS, BALANCE, BALANCES, DATA_OWNERS, DATA_VALIDATORS} from "../endpoints";
import {
    AccountResponse,
    RegisterAccountRequest,
    RegisterAccountResponse,
    BalanceResponse,
    AccountBalanceMapping,
    RegisterDataOwnerRequest,
    DataOwnersResponse
} from "../../models";

export class AccountsService {
    public static registerAccount(registerAccountRequest: RegisterAccountRequest): AxiosPromise<RegisterAccountResponse> {
        return axiosInstance.post(`/${ACCOUNTS}`, registerAccountRequest)
    }

    public static fetchRegisteredAccounts(): AxiosPromise<AccountResponse[]> {
        return axiosInstance.get(`/${ACCOUNTS}`);
    }

    public static getBalanceOfAccount(address: string): AxiosPromise<BalanceResponse> {
        return axiosInstance.get(`/${ACCOUNTS}/${address}/${BALANCE}`);
    }

    public static getBalancesOfAllAccounts(): AxiosPromise<AccountBalanceMapping> {
        return axiosInstance.get(`/${ACCOUNTS}/${BALANCES}`);
    }

    public static registerDataOwner(registerDataOwnerRequest: RegisterDataOwnerRequest): AxiosPromise<DataOwnersResponse> {
        return axiosInstance.post(`/${ACCOUNTS}/${DATA_OWNERS}`, registerDataOwnerRequest);
    }

    public static getDataOwnersOfDataValidator(address: string): AxiosPromise<DataOwnersResponse> {
        return axiosInstance.get(`/${ACCOUNTS}/${DATA_VALIDATORS}/${address}/${DATA_OWNERS}`);
    }
}
