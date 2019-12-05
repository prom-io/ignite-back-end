import {AccountType} from "../../entity";

export interface ICreateAccountRequest {
    address: string,
    type: AccountType
}
