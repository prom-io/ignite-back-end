import {EthereumSingature} from "./EthereumSingature";
import {SignedRequest} from "./SignedRequest";
import {AccountType} from "../../../accounts/types";

export interface RegisterAccountRequest extends SignedRequest {
    address: string,
    type: AccountType,
}
