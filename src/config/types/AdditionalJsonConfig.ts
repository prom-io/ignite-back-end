import {AccountsToSubscribeConfig} from "./AccountsToSubscribeConfig";
import {AdminUsersConfig} from "./AdminUsersConfig";
import {FirebaseConfig} from "./FirebaseConfig";

export interface AdditionalJsonConfig {
    accountsToSubscribe?: AccountsToSubscribeConfig;
    adminUsers?: string[];
    firebase?: FirebaseConfig
}
