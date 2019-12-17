import {AxiosInstance, AxiosPromise} from "axios";
import {axiosInstance} from "../api-client";
import {TransactionResponse, TransactionType} from "../../models";
import {TRANSACTIONS} from "../endpoints";

export class TransactionsService {

    public static getTransactionsByAddress(address: string, page: number, size: number): AxiosPromise<TransactionResponse[]> {
        return axiosInstance.get(`/${TRANSACTIONS}?address=${address}&page=${page}&size=${size}`);
    }

    public static getTransactionsByAddressAndType(address: string, type: TransactionType, page: number, size: number): AxiosPromise<TransactionResponse[]> {
        return axiosInstance.get(`/${TRANSACTIONS}?address=${address}&page=${page}&size=${size}&type=${type}`);
    }
}
