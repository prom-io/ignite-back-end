import {action, computed, observable, reaction} from "mobx";
import {AxiosError, AxiosPromise} from "axios";
import uniqBy from "lodash.uniqby";
import {ApiError, createErrorFromResponse, TransactionsService} from "../../api";
import {TransactionResponse, TransactionType} from "../../models";
import {AccountsStore} from "../../Account";
import {SettingsStore} from "../../Settings";

const PAGE_SIZE = 50;

export class TransactionsStore {
    private readonly settingsStore: SettingsStore;
    private readonly accountsStore: AccountsStore;

    @observable
    transactions: TransactionResponse[] = [];

    @observable
    page: number = 0;

    @observable
    pending: boolean = false;

    @observable
    error?: ApiError = undefined;

    @computed
    get selectedAccount(): string | undefined {
        return this.settingsStore.selectedDataValidatorAccount;
    }

    @computed
    get accounts(): string[] {
        return this.accountsStore.accounts.map(account => account.address);
    }

    @observable
    refreshOnAccountChange: boolean = false;

    @observable
    transactionType?: TransactionType = undefined;

    constructor(settingsStore: SettingsStore, accountsStore: AccountsStore) {
        this.settingsStore = settingsStore;
        this.accountsStore = accountsStore;

        reaction(
            () => this.selectedAccount,
            () => {
               if (this.refreshOnAccountChange) {
                   this.transactions = [];
                   this.page = 0;
                   this.fetchTransactions();
               }
            }
        )
    }

    @action
    setRefreshOnAccountChange = (refreshOnAccountChange: boolean): void => {
        this.refreshOnAccountChange = refreshOnAccountChange;
    };

    @action
    setTransactionType = (transactionType: TransactionType | undefined): void => {
        this.transactionType = transactionType;
    };

    @action
    fetchTransactions = (): void => {
        if (this.selectedAccount) {
            this.pending = true;
            this.error = undefined;

            let fetchTransactionsPromise: AxiosPromise<TransactionResponse[]>;

            if (this.transactionType === TransactionType.DATA_PURCHASE) {
                fetchTransactionsPromise = TransactionsService.getTransactionsByAddressAndType(this.selectedAccount, TransactionType.DATA_PURCHASE,this.page, PAGE_SIZE);
            } else {
                fetchTransactionsPromise = TransactionsService.getTransactionsByAddress(this.selectedAccount, this.page, PAGE_SIZE);
            }

            fetchTransactionsPromise
                .then(({data}) => {
                    if (data.length !==0) {
                        this.transactions.push(...data);
                        this.transactions = uniqBy(this.transactions, "hash");

                        if (data.length === PAGE_SIZE) {
                            this.page = this.page + 1;
                        }
                    }
                })
                .catch((error: AxiosError) => this.error = createErrorFromResponse(error))
                .finally(() => this.pending = false);
        }
    };

    @action
    setSelectedAccount = (account: string): void => {
        this.settingsStore.selectDataValidatorAccount(account);
    };

    @action
    reset = (): void => {
        this.transactions = [];
        this.page = 0;
        this.error = undefined;
        this.transactionType = undefined;
    };

    @action
    updateStorageDuration = (fileId: string, storageDuration: string): void => {
        this.transactions = this.transactions.map(transaction => {
            if (transaction.file.id === fileId) {
                transaction.file.keepUntil = storageDuration;
            }

            return transaction;
        })
    }
}
