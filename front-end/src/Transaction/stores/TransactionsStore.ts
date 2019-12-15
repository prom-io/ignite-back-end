import {observable, action, computed, reaction, toJS} from "mobx";
import {AxiosError} from "axios";
import uniqBy from "lodash.uniqby";
import {ApiError, createErrorFromResponse, TransactionsService} from "../../api";
import {TransactionsByAddresses} from "../../models";
import {normalize} from "../../utils";
import {SettingsStore} from "../../Settings";
import {AccountsStore} from "../../Account";

const PAGE_SIZE = 100;

export class TransactionsStore {
    private readonly settingsStore: SettingsStore;
    private readonly accountsStore: AccountsStore;

    @computed
    get dataValidatorAddress(): string | undefined {
        return this.settingsStore.selectedDataValidatorAccount;
    }

    @observable
    pending: boolean = false;

    @observable
    transactions: TransactionsByAddresses = {};

    @observable
    error?: ApiError = undefined;

    constructor(settingsStore: SettingsStore, accountsStore: AccountsStore) {
        this.settingsStore = settingsStore;
        this.accountsStore = accountsStore;

        reaction(
            () => this.accountsStore.accounts,
            accounts => {
                accounts.forEach(account => this.transactions[account.address] = {
                    pending: false,
                    pagination: {page: 0},
                    transactions: []
                })
            }
        )
    }

    @action
    fetchTransactions = (address: string): void => {
        if (this.transactions[address]) {
            this.transactions[address].pending = true;
            const page = this.transactions[address].pagination.page;

            TransactionsService.findTransactionsByAddress(address, page)
                .then(({data}) => {
                    data = data.filter(transaction => transaction.type === "dataPurchase");
                    if (data.length !== 0) {
                        const transactions = normalize(data, "hash");
                        console.log(toJS(transactions));
                        this.transactions[address].transactions.push(...data);
                        this.transactions[address].transactions = uniqBy(this.transactions[address].transactions, "hash");
                        if (data.length === PAGE_SIZE) {
                            this.transactions[address].pagination.page +=1;
                        }
                    }
                })
                .catch((error: AxiosError) => this.error = createErrorFromResponse(error))
                .finally(() => this.transactions[address].pending = false);
        } else {
            this.transactions[address] = {
                pagination: {
                    page: 0
                },
                pending: true,
                transactions: []
            };

            TransactionsService.findTransactionsByAddress(address, 1)
                .then(({data}) => {
                    if (data.length !== 0) {
                        this.transactions[address].transactions = this.transactions[address].transactions.concat(data);
                        if (data.length === PAGE_SIZE) {
                            this.transactions[address].pagination.page +=1;
                        }
                    }
                })
                .catch((error: AxiosError) => this.error = createErrorFromResponse(error))
                .finally(() => this.transactions[address].pending = false);
        }
    };

    @action
    reset = (): void => {
        this.pending = false;
        this.error = undefined;
    };

    @action
    updateFileStorageDuration = (dataValidatorAddress: string, fileId: string, keepUntil: string): void => {
        this.transactions[dataValidatorAddress].transactions.map(transaction => {
            if (transaction.file && transaction.file.id === fileId) {
                transaction.file.keepUntil = keepUntil;
            }
            return transaction;
        })
    }
}
