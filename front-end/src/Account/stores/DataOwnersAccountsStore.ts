import {action, computed, observable, reaction} from "mobx";
import {AccountsStore} from "./AccountsStore";
import {AccountsService} from "../../api";
import {DataOwnerResponse} from "../../models";

export class DataOwnersAccountsStore {
    private readonly accountStore: AccountsStore;

    @observable
    dataOwners: {[dataValidatorAddress: string]: DataOwnerResponse[]} = {};

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
                        [dataValidator]: data.dataOwners
                    };
                })
                .catch(_ => {})
        });
    };

    @action
    addDataOwner = (dataOwner: DataOwnerResponse): void => {
        this.dataOwners = {
            ...this.dataOwners,
            [dataOwner.dataValidatorAddress]: [...this.dataOwners[dataOwner.dataValidatorAddress], dataOwner]
        };
    };
}
