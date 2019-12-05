import {AxiosError} from "axios";
import {action, computed, observable} from "mobx";
import Web3 from "web3";
import {DataOwnersAccountsStore} from "./DataOwnersAccountsStore";
import {AccountsService, ApiError, createErrorFromResponse} from "../../api";
import {SettingsStore} from "../../Settings";

export class CreateDataOwnerStore {
    private readonly settingsStore: SettingsStore;
    private readonly dataOwnersStore: DataOwnersAccountsStore;
    private readonly web3: Web3;

    @observable
    pending: boolean = false;

    @observable
    error?: ApiError = undefined;

    @observable
    showSnackbar: boolean = false;

    @computed
    get dataValidator(): string | undefined {
        return this.settingsStore.selectedDataValidatorAccount;
    }

    constructor(settingsStore: SettingsStore, dataOwnersStore: DataOwnersAccountsStore) {
        this.settingsStore = settingsStore;
        this.dataOwnersStore = dataOwnersStore;
        this.web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_WEB3_HTTP_PROVIDER as string));
    }

    @action
    createNewDataOwner = (): void => {
        if (this.dataValidator) {
            this.pending = true;
            const account = this.web3.eth.accounts.create();
            const address = account.address;

            AccountsService.registerDataOwner({
                address,
                dataValidatorAddress: this.dataValidator
            }).then(() => {
                this.dataOwnersStore.addDataOwner(address, this.dataValidator!);
                this.showSnackbar = true;
            })
                .catch((error: AxiosError) => {
                    console.log(error);
                    this.error = createErrorFromResponse(error);
                    this.showSnackbar = true;
                })
                .finally(() => this.pending = false);
        }
    };

    @action
    setShowSnackbar = (showSnackbar: boolean): void => {
        this.showSnackbar = showSnackbar;
    }
}
