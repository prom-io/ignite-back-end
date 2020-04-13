import {Injectable} from "@nestjs/common";
import {DefaultAccountRepository} from "./DefaultAccountRepository";
import {Account} from "../accounts/types/entity";
import {NoAccountsRegisteredException} from "../accounts/NoAccountsRegisteredException";

@Injectable()
export class DefaultAccountProviderService {
    constructor(private readonly defaultAccountRepository: DefaultAccountRepository) {
    }

    public async getDefaultAccount(): Promise<Account> {
        const account = await this.defaultAccountRepository.getDefaultAccount();

        if (account) {
            return account;
        } else {
            const accounts = await this.defaultAccountRepository.findAll();

            if (accounts.length === 0) {
                throw new NoAccountsRegisteredException("Node doesn't have any accounts registered");
            }

            let firstAccount = accounts[0];
            firstAccount.default = true;
            firstAccount = await this.defaultAccountRepository.save(firstAccount);
            return firstAccount;
        }
    }
}
