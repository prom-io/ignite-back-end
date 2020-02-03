import {AccountType} from "../../../accounts/types";

export interface AccountRegistrationStatusResponse {
    registered: boolean,
    role?: AccountType
}
