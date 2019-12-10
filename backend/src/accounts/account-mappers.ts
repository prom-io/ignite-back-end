import {Account, DataOwner, EntityType} from "../model/entity";
import {CreateDataOwnerRequest} from "../model/api/request";
import {AccountResponse, DataOwnerResponse} from "../model/api/response";
import {fileToFileResponse} from "../files/file-mappers";

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
    privateKey: createDataOwnerRequest.address,
    dataValidatorAddress: createDataOwnerRequest.dataValidatorAddress,
    _type: EntityType.DATA_OWNER,
});
