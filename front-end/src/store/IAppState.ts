import {
    AccountRegistrationStore,
    AccountsBalanceStore,
    AccountsStore,
    CreateDataOwnerStore,
    DataOwnersAccountsStore
} from "../Account";
import {AddMetadataDialogStore, EditMetadataDialogStore, UploadDataStore} from "../DataUpload";
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
    createDataOwner: CreateDataOwnerStore,
    dataValidatorRegistration: AccountRegistrationStore,
}
