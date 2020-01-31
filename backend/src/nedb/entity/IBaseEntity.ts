import {EntityType} from "./EntityType";

export interface IBaseEntity {
    _id?: string,
    _type: EntityType
}
