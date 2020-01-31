import {File} from "../../../files/types/entity/File";
import {IBaseEntity} from "../../../nedb/entity";

export interface DataOwner extends IBaseEntity {
    address: string,
    dataValidatorAddress: string,
    file?: File,
    privateKey: string
}
