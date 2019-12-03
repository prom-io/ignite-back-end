import {Account} from "../model/entity";
import {AccountResponse} from "../model/api/response";

export const accountToAccountResponse = (account: Account): AccountResponse => ({
    address: account.address
});
