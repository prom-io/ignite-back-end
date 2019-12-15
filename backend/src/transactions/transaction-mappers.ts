import {DataOwnerResponse, FileResponse, ServiceNodeTransactionResponse, TransactionResponse} from "../model/api/response";

// tslint:disable-next-line:max-line-length
export const serviceNodeTransactionToTransactionResponse = (serviceNodeTransaction: ServiceNodeTransactionResponse, file: FileResponse, dataOwner: DataOwnerResponse): TransactionResponse => ({
    dataMart: serviceNodeTransaction.dataMart,
    dataOwner,
    file,
    hash: serviceNodeTransaction.hash,
    sum: serviceNodeTransaction.value,
    createdAt: serviceNodeTransaction.created_at,
    type: serviceNodeTransaction.type
});
