import {action, computed, observable} from "mobx";
import {DataOwnersAccountsStore} from "./DataOwnersAccountsStore";
import {ApiError} from "../../api";
import {UploadDataStore} from "../../DataUpload";
import {SettingsStore} from "../../Settings";

export class CreateDataOwnerStore {
    private readonly settingsStore: SettingsStore;
    private readonly dataOwnersStore: DataOwnersAccountsStore;
    public readonly dataUpload: UploadDataStore;

    @observable
    dataOwnerCreationPending: boolean = false;

    @observable
    createdDataOwnerAddress?: string = undefined;

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

    @computed
    get pending(): boolean {
        return this.dataUpload.pending || this.dataOwnerCreationPending;
    }

    constructor(settingsStore: SettingsStore, dataOwnersStore: DataOwnersAccountsStore, dataUpload: UploadDataStore) {
        this.settingsStore = settingsStore;
        this.dataOwnersStore = dataOwnersStore;
        this.dataUpload = dataUpload;
    }

    @action
    createNewDataOwner = async (): Promise<void> => {
        if (this.dataValidator && this.dataUpload.isFormValid()) {
            this.dataOwnerCreationPending = true;

            this.dataUpload.uploadData()
                .then(() => {
                    this.error = this.dataUpload.submissionError;
                    this.showSnackbar = true;
                    this.dataOwnerCreationPending = false;
                })
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
