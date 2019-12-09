import {AxiosError} from "axios";
import {action, computed, observable} from "mobx";
import Web3 from "web3";
import {DataOwnersAccountsStore} from "./DataOwnersAccountsStore";
import {AccountsService, ApiError, createErrorFromResponse} from "../../api";
import {UploadDataStore} from "../../DataUpload";
import {SettingsStore} from "../../Settings";

export class CreateDataOwnerStore {
    private readonly settingsStore: SettingsStore;
    private readonly dataOwnersStore: DataOwnersAccountsStore;
    public readonly dataUpload: UploadDataStore;
    private readonly web3: Web3;

    @observable
    pending: boolean = false;

    @observable
    error?: ApiError = undefined;

    @observable
    showSnackbar: boolean = false;

    @observable
    dialogOpen: boolean = false;

    @computed
    get dataValidator(): string | undefined {
        return this.settingsStore.selectedDataValidatorAccount;
    }

    constructor(settingsStore: SettingsStore, dataOwnersStore: DataOwnersAccountsStore, dataUpload: UploadDataStore) {
        this.settingsStore = settingsStore;
        this.dataOwnersStore = dataOwnersStore;
        this.dataUpload = dataUpload;
        this.web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_WEB3_HTTP_PROVIDER as string));
    }

    @action
    createNewDataOwner = (): Promise<void> => {
        if (this.dataValidator && this.dataUpload.isFormValid()) {
            this.pending = true;
            const account = this.web3.eth.accounts.create();
            const address = account.address;

            return AccountsService.registerDataOwner({
                address,
                dataValidatorAddress: this.dataValidator,
                privateKey: account.privateKey
            }).then(async ({data}) => {
                await this.dataUpload.uploadData();
                this.dataOwnersStore.addDataOwner(data);
                this.showSnackbar = true;
            })
                .catch((error: AxiosError) => {
                    console.log(error);
                    this.error = createErrorFromResponse(error);
                    this.showSnackbar = true;
                })
                .finally(() => this.pending = false);
        } else return new Promise<void>(resolve => resolve())
    };

    @action
    setShowSnackbar = (showSnackbar: boolean): void => {
        this.showSnackbar = showSnackbar;
    };

    @action
    setDialogOpen = (open: boolean): void => {
        this.dialogOpen = open;
    }
}
