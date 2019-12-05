import {action, reaction, computed, observable} from "mobx";
import {DataOwnersAccountsStore} from "../../Account";
import {SettingsStore} from "../../Settings/stores";

export class DataOwnerSelectStore {
    private readonly dataOwnersAccounts: DataOwnersAccountsStore;
    private readonly settings: SettingsStore;

    @observable
    selectedDataOwner?: string;

    @computed
    get pending(): boolean {
        return this.dataOwnersAccounts.pending;
    }

    @computed
    get dataValidator(): string | undefined {
        return this.settings.selectedDataValidatorAccount
    }

    @computed
    get dataOwners(): string[] {
        if (this.dataValidator) {
            return this.dataOwnersAccounts.dataOwners[this.dataValidator] || [];
        } else {
            return [];
        }
    }

    constructor(dataOwnersAccounts: DataOwnersAccountsStore, settings: SettingsStore) {
        this.dataOwnersAccounts = dataOwnersAccounts;
        this.settings = settings;

        reaction(
            () => this.dataOwners,
            () => this.selectedDataOwner = undefined
        )
    }

    @action
    setSelectedDataOwner = (selectedDataOwner: string): void => {
        this.selectedDataOwner = selectedDataOwner;
    }
}
