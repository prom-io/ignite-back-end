import {
    AccountsStore,
    AccountsBalanceStore,
    AccountRegistrationStore,
    DataOwnersAccountsStore,
    CreateDataOwnerStore
} from "../Account";
import {UploadDataStore, AddMetadataDialogStore, EditMetadataDialogStore, DataOwnerSelectStore} from "../DataUpload";
import {DrawerStore} from "../AppBar";
import {SettingsStore} from "../Settings";

export interface IAppState {
    store?: any, //needed for Mobx-router
    dataUpload: UploadDataStore,
    metadataAdding: AddMetadataDialogStore,
    metadataEdit: EditMetadataDialogStore,
    registration: AccountRegistrationStore,
    drawer: DrawerStore,
    settings: SettingsStore,
    accounts: AccountsStore,
    balances: AccountsBalanceStore,
    dataOwners: DataOwnersAccountsStore,
    dataOwnerSelect: DataOwnerSelectStore,
    createDataOwner: CreateDataOwnerStore,
    dataValidatorRegistration: AccountRegistrationStore,
}
