import {AccountType} from "./AccountType";

export interface RegisterAccountRequest {
    address: string,
    privateKey: string,
    type: AccountType
}
