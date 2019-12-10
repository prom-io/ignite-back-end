import {TransactionResponse, BillingTransactionResponse, FileResponse} from "../model/api/response";

export const billingTransactionToTransactionResponse = (billingTransaction: BillingTransactionResponse, file: FileResponse, dataOwner: string): TransactionResponse => ({
    dataMart: billingTransaction.from,
    dataOwner,
    file,
    hash: billingTransaction.hash,
    sum: billingTransaction.sum
});
