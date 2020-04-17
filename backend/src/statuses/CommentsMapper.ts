import {Injectable} from "@nestjs/common";
import uuid from "uuid/v4";
import {Comment, Status} from "./entities";
import {CommentResponse} from "./types/response/CommentResponse";
import {CreateCommentRequest} from "./types/request/CreateCommentRequest";
import {UsersMapper} from "../users/UsersMapper";
import {User} from "../users/entities";
import {MediaAttachment} from "../media-attachments/entities";
import {MediaAttachmentsMapper} from "../media-attachments/MediaAttachmentsMapper";

export interface ToCommentResponseOptions {
    comment: Comment,
    repostsCount: number
}

export interface FromCreateCommentRequestOptions {
    createCommentRequest: CreateCommentRequest,
    status: Status,
    author: User,
    mediaAttachments: MediaAttachment[]
}

@Injectable()
export class CommentsMapper {
    constructor(private readonly usersMapper: UsersMapper,
                private readonly mediaAttachmentsMapper: MediaAttachmentsMapper) {
    }

    public toCommentResponse(options: ToCommentResponseOptions): CommentResponse {
        return new CommentResponse({
            id: options.comment.id,
            createdAt: options.comment.createdAt.toISOString(),
            mediaAttachments: options.comment.mediaAttachments
                .map(mediaAttachment => this.mediaAttachmentsMapper.toMediaAttachmentResponse(mediaAttachment)),
            statusId: options.comment.status.id,
            text: options.comment.text,
            author: this.usersMapper.toUserResponse(options.comment.author),
            repostsCount: options.repostsCount
        })
    }

    public fromCreateCommentRequest(options: FromCreateCommentRequestOptions): Comment {
        return {
            id: uuid(),
            text: options.createCommentRequest.text,
            status: options.status,
            author: options.author,
            mediaAttachments: options.mediaAttachments,
            createdAt: new Date(),
            btfsHash: undefined,
            peerIp: undefined,
            peerWallet: undefined,
            repostedComment: undefined,
            updatedAt: undefined
        }
    }
}
