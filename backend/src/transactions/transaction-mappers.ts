import {TransactionResponse, BillingTransactionResponse, FileResponse, DataOwnerResponse} from "../model/api/response";

// tslint:disable-next-line:max-line-length
export const billingTransactionToTransactionResponse = (billingTransaction: BillingTransactionResponse, file: FileResponse, dataOwner: DataOwnerResponse): TransactionResponse => ({
    dataMart: billingTransaction.from,
    dataOwner,
    file,
    hash: billingTransaction.hash,
    sum: billingTransaction.value,
    createdAt: billingTransaction.createdAt
});
