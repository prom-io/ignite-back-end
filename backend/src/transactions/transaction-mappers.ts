import {TransactionResponse, ServiceNodeTransactionResponse} from "./types/response";
import {FileResponse} from "../files/types/response";
import {DataOwnerResponse} from "../accounts/types/response";

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
