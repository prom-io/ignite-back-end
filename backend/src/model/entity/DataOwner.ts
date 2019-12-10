import {File} from "./File";
import {IBaseEntity} from "./IBaseEntity";

export interface DataOwner extends IBaseEntity {
    address: string,
    dataValidatorAddress: string,
    file?: File,
    privateKey: string
}
