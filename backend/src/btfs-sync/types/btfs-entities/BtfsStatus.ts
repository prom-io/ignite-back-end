import {BtfsUser} from "./BtfsUser";

export interface BtfsStatus {
    id: string,
    text: string,
    author: BtfsUser,
    mediaAttachments: string[],
    createdAt: string
}
