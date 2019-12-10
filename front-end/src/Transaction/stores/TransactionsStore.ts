import {observable, action, computed} from "mobx";
import {ApiError, createErrorFromResponse, TransactionsService} from "../../api";
import {TransactionResponse} from "../../models";
import {SettingsStore} from "../../Settings/stores";
import {AxiosError} from "axios";

export class TransactionsStore {
    private readonly settingsStore: SettingsStore;

    @computed
    get dataValidatorAddress(): string | undefined {
        return this.settingsStore.selectedDataValidatorAccount;
    }

    @observable
    pending: boolean = false;

    @observable
    transactions: TransactionResponse[] = [];

    @observable
    error?: ApiError = undefined;


    constructor(settingsStore: SettingsStore) {
        this.settingsStore = settingsStore;
    }

    fetchTransactions = (): void => {
        if (this.dataValidatorAddress) {
            this.pending = false;
            this.error = undefined;

            TransactionsService.findTransactionsByAddress(this.dataValidatorAddress)
                .then(({data}) => this.transactions = [
                    ...this.transactions,
                    ...data
                ])
                .catch((error: AxiosError) => this.error = createErrorFromResponse(error))
                .finally(() => this.pending = false)
        }
    };

    reset = (): void => {
        this.transactions = [];
        this.pending = false;
        this.error = undefined;
    }
}
