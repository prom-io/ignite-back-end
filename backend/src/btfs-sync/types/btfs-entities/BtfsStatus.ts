import {BtfsUser} from "./BtfsUser";
import {BtfsMediaAttachment} from "./BtfsMediaAttachment";

export interface BtfsStatus {
    id: string,
    text: string,
    author: BtfsUser,
    mediaAttachments: BtfsMediaAttachment[],
    createdAt: string
}
