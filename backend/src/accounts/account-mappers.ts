import {Account, DataOwner} from ".types/entity";
import {CreateDataOwnerRequest} from "./types/request";
import {AccountResponse, DataOwnerResponse} from "./types/response";
import {fileToFileResponse} from "../files/file-mappers";
import {EntityType} from "../nedb/entity";

export const accountToAccountResponse = (account: Account): AccountResponse => ({
    address: account.address
});

export const dataOwnerToDataOwnerResponse = (dataOwner: DataOwner): DataOwnerResponse => ({
    address: dataOwner.address,
    dataValidatorAddress: dataOwner.dataValidatorAddress,
    file: dataOwner.file ? fileToFileResponse(dataOwner.file) : undefined,
    privateKey: dataOwner.privateKey
});

export const createDataOwnerRequestToDataOwner = (createDataOwnerRequest: CreateDataOwnerRequest): DataOwner => ({
    address: createDataOwnerRequest.address,
    privateKey: createDataOwnerRequest.privateKey,
    dataValidatorAddress: createDataOwnerRequest.dataValidatorAddress,
    _type: EntityType.DATA_OWNER,
});
