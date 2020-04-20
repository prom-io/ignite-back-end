import {Injectable} from "@nestjs/common";
import {BtfsMediaAttachmentsMapper} from "./BtfsMediaAttachmentsMapper";
import {BtfsUsersMapper} from "./BtfsUsersMapper";
import {BtfsComment} from "../types/btfs-entities/BtfsComment";
import {Comment} from "../../statuses/entities";
import {BtfsStatusesMapper} from "./BtfsStatusesMapper";

@Injectable()
export class BtfsCommentsMapper {
    constructor(private readonly btfsStatusesMapper: BtfsStatusesMapper,
                private readonly btfsMediaAttachmentsMapper: BtfsMediaAttachmentsMapper,
                private readonly btfsUsersMapper: BtfsUsersMapper) {
    }

    public fromComment(comment: Comment): BtfsComment {
        return new BtfsComment({
            id: comment.id,
            text: comment.text,
            status: this.btfsStatusesMapper.fromStatus(comment.status),
            createdAt: comment.createdAt.toISOString(),
            author: this.btfsUsersMapper.fromUser(comment.author),
            mediaAttachments: comment.mediaAttachments.map(mediaAttachment => this.btfsMediaAttachmentsMapper.fromMediaAttachment(mediaAttachment))
        })
    }
}
