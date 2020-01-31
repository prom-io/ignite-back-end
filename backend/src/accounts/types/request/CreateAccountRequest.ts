import {AccountType} from "../AccountType";

export interface CreateAccountRequest {
    address: string,
    type: AccountType
}
