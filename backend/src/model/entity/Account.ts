import {IBaseEntity} from "./IBaseEntity";

export interface Account extends IBaseEntity {
    address: string,
    privateKey: string
}
