import {BtfsUser} from "./BtfsUser";

export interface BtfsUserSubscription {
    id: string,
    subscribedUser: BtfsUser,
    subscribedTo: BtfsUser,
    createdAt: string
}
