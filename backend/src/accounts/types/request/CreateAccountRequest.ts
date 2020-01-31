import {AccountType} from "../../../model/entity";

export interface CreateAccountRequest {
    address: string,
    type: AccountType
}
