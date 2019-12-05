import {action, computed, observable, reaction} from "mobx";
import {AccountsStore} from "./AccountsStore";
import {AccountsService} from "../../api";

export class DataOwnersAccountsStore {
    private readonly accountStore: AccountsStore;

    @observable
    dataOwners: {[dataValidatorAddress: string]: string[]} = {};

    @observable
    pending: boolean = false;

    @computed
    get dataValidators(): string[] {
        return this.accountStore.accounts.map(account => account.address);
    }

    constructor(accountsStore: AccountsStore) {
        this.accountStore = accountsStore;
        this.fetchDataOwners();

        reaction(
            () => this.dataValidators,
            () => this.fetchDataOwners()
        )
    }

    @action
    fetchDataOwners = (): void => {
        this.dataValidators.forEach(dataValidator => {
            AccountsService.getDataOwnersOfDataValidator(dataValidator)
                .then(({data}) => {
                    this.dataOwners = {
                        ...this.dataOwners,
                        [dataValidator]: [...data.dataOwners]
                    };
                })
                .catch(_ => {})
        });
    };

    @action
    addDataOwner = (address: string, dataValidatorAddress: string): void => {
        this.dataOwners = {
            ...this.dataOwners,
            [dataValidatorAddress]: [...this.dataOwners[dataValidatorAddress], address]
        };
    };
}
