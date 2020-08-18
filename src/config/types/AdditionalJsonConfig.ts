import {AccountsToSubscribeConfig} from "./AccountsToSubscribeConfig";
import {AdminUsersConfig} from "./AdminUsersConfig";
import {FirebaseConfig} from "./FirebaseConfig";
import { MemezatorRewardForPlaces } from "./MemezatorReward";

export interface AdditionalJsonConfig {
    accountsToSubscribe?: AccountsToSubscribeConfig;
    adminUsers?: string[];
    firebase?: FirebaseConfig;
    memezator: {
        rewards: {
            [date: string]: MemezatorRewardForPlaces
        }
    }
}
