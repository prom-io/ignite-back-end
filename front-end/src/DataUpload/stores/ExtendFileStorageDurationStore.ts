import {action, observable, reaction} from "mobx";
import {ApiError, createErrorFromResponse, DataUploadService} from "../../api";
import {FileInfoResponse} from "../../models";
import {DataOwnersAccountsStore} from "../../Account/stores";
import {SettingsStore} from "../../Settings/stores";
import {AxiosError} from "axios";
import {format} from "date-fns";

export class ExtendFileStorageDurationStore {
    private readonly dataOwnersAccountsStore: DataOwnersAccountsStore;
    private readonly settingsStore: SettingsStore;

    @observable
    keepUntil?: Date = undefined;

    @observable
    file?: FileInfoResponse = undefined;

    @observable
    pending: boolean = false;

    @observable
    error?: ApiError = undefined;

    @observable
    showSnackbar: boolean = false;

    @observable
    response?: {success: boolean} = undefined;

    constructor(dataOwnersAccountsStore: DataOwnersAccountsStore, settingsStore: SettingsStore) {
        this.dataOwnersAccountsStore = dataOwnersAccountsStore;
        this.settingsStore = settingsStore;

        reaction(
            () => this.file,
            () => {
                if (this.file) {
                    this.keepUntil = new Date(this.file.keepUntil)
                }
            }
        )
    }

    @action
    setFile = (file: FileInfoResponse | undefined): void => {
        this.file = file;
    };

    @action
    setKeepUntil = (keepUntil: Date): void => {
        this.keepUntil = keepUntil;
    };

    @action
    setShowSnackBar = (showSnackBar: boolean): void => {
        this.showSnackbar = showSnackBar;
    };

    @action
    extendFileStorageDuration = (): void => {
        if (this.file && this.keepUntil) {
            this.pending = true;
            this.error = undefined;

            DataUploadService.extendFileStorageDuration(this.file.id, {keepUntil: this.keepUntil})
                .then(({data}) => {
                    this.response = data;
                    this.dataOwnersAccountsStore.updateFileStorageDuration(
                        this.settingsStore.selectedDataValidatorAccount!,
                        this.file!.id,
                        this.keepUntil!.toISOString()
                    )
                })
                .catch((error: AxiosError) => this.error = createErrorFromResponse(error))
                .finally(() => {
                    this.pending = false;
                    this.showSnackbar = true;
                })
        }
    };
}
