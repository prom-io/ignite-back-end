import {IBaseEntity} from "./IBaseEntity";

export interface PrivateKey extends IBaseEntity {
    dataOwnerAddress: string,
    dataValidatorAddress: string,
    privateKey: string
}
