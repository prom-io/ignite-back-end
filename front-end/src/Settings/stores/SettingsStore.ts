import {action, computed, observable} from "mobx";
import {AccountResponse} from "../../models";
import {ApiError} from "../../api";
import {AccountsStore} from "../../Account";

export class SettingsStore {
    private readonly accountsStore: AccountsStore;

    @observable
    selectedDataValidatorAccount?: string = localStorage.getItem("selectedDataValidatorAccount") !== null
        ? localStorage.getItem("selectedDataValidatorAccount")!
        : undefined;

    @computed
    get dataValidatorAccounts(): AccountResponse[] {
        return this.accountsStore.accounts;
    }

    @computed
    get registeredAccounts(): AccountResponse[] {
        return this.accountsStore.accounts;
    }

    @computed
    get fetchingAccounts(): boolean {
        return this.accountsStore.fetchingAccounts;
    }

    @computed
    get fetchingAccountsError(): ApiError | undefined {
        return this.accountsStore.accountsFetchingError;
    }

    constructor(accountsStore: AccountsStore) {
        this.accountsStore = accountsStore;
    }

    @action
    selectDataValidatorAccount = (accountAddress: string): void => {
        localStorage.setItem("selectedDataValidatorAccount", accountAddress);
        this.selectedDataValidatorAccount = accountAddress;
    };
}
