import {AxiosInstance, AxiosPromise} from "axios";
import {axiosInstance} from "../api-client";
import {TransactionResponse} from "../../models";
import {TRANSACTIONS} from "../endpoints";

export class TransactionsService {

    public static findTransactionsByAddress(address: string, page: number): AxiosPromise<TransactionResponse[]> {
        return axiosInstance.get(`/${TRANSACTIONS}?address=${address}&page=${page}`);
    }
}
