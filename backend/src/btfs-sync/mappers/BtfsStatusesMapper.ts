import {Injectable} from "@nestjs/common";
import {Status} from "../../statuses/entities";
import {BtfsStatus} from "../types/btfs-entities";
import {BtfsUsersMapper} from "./BtfsUsersMapper";
import {BtfsMediaAttachmentsMapper} from "./BtfsMediaAttachmentsMapper";

@Injectable()
export class BtfsStatusesMapper {
    constructor(private readonly btfsUsersMapper: BtfsUsersMapper,
                private readonly btfsMediaAttachmentsMapper: BtfsMediaAttachmentsMapper) {
    }

    public fromStatus(status: Status): BtfsStatus {
        return {
            id: status.id,
            createdAt: status.createdAt.toISOString(),
            mediaAttachments: status.mediaAttachments.map(mediaAttachment => this.btfsMediaAttachmentsMapper.fromMediaAttachment(mediaAttachment)),
            author: this.btfsUsersMapper.fromUser(status.author),
            text: status.text,
            repostedStatusId: status.repostedStatus ? status.repostedStatus.id : null
        }
    }
}
