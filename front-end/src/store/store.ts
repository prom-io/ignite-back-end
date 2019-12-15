import {IAppState} from "./IAppState";
import {
    AccountRegistrationStore,
    AccountsBalanceStore,
    AccountsStore,
    CreateDataOwnerStore,
    DataOwnersAccountsStore
} from "../Account";
import {
    AddMetadataDialogStore,
    EditMetadataDialogStore,
    ExtendFileStorageDurationStore,
    UploadDataStore
} from "../DataUpload";
import {DrawerStore} from "../AppBar";
import {SettingsStore} from "../Settings";
import {AccountType} from "../models";
import {TransactionsStore} from "../Transaction";

const accounts = new AccountsStore();
const balances = new AccountsBalanceStore(accounts);
const settings = new SettingsStore(accounts);
const dataUpload = new UploadDataStore(settings);
const registration = new AccountRegistrationStore(accounts, AccountType.DATA_VALIDATOR);
const dataValidatorRegistration = new AccountRegistrationStore(accounts, AccountType.DATA_VALIDATOR);
const dataOwners = new DataOwnersAccountsStore(accounts);
const createDataOwner = new CreateDataOwnerStore(settings, dataOwners, dataUpload);
const transactions = new TransactionsStore(settings, accounts);
const fileStorageDurationExtension = new ExtendFileStorageDurationStore(dataOwners, settings, transactions);

export const store: IAppState = {
    dataUpload,
    settings,
    metadataAdding: new AddMetadataDialogStore(),
    metadataEdit: new EditMetadataDialogStore(),
    registration,
    drawer: new DrawerStore(),
    accounts,
    balances,
    dataOwners,
    createDataOwner,
    dataValidatorRegistration,
    transactions,
    fileStorageDurationExtension
};
