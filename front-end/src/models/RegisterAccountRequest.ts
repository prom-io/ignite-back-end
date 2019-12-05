import {AccountType} from "./AccountType";

export interface RegisterAccountRequest {
    address: string,
    type: AccountType
}
