import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {CommentsRepository} from "./CommentsRepository";
import {StatusesRepository} from "./StatusesRepository";
import {CommentsMapper} from "./CommentsMapper";
import {CreateCommentRequest} from "./types/request/CreateCommentRequest";
import {CommentResponse} from "./types/response/CommentResponse";
import {MediaAttachment} from "../media-attachments/entities";
import {MediaAttachmentsRepository} from "../media-attachments/MediaAttachmentsRepository";
import {User} from "../users/entities";
import {asyncForEach} from "../utils/async-foreach";
import {PaginationRequest} from "../utils/pagination";

@Injectable()
export class CommentsService {
    constructor(private readonly commentsRepository: CommentsRepository,
                private readonly statusesRepository: StatusesRepository,
                private readonly mediaAttachmentsRepository: MediaAttachmentsRepository,
                private readonly commentsMapper: CommentsMapper) {
    }

    public async createComment(createCommentRequest: CreateCommentRequest, statusId: string, currentUser: User): Promise<CommentResponse> {
        const status = await this.statusesRepository.findById(statusId);

        if (!status) {
            throw new HttpException(
                `Could not find status with id ${statusId}`,
                HttpStatus.NOT_FOUND
            )
        }

        const mediaAttachments: MediaAttachment[] = [];

        if (createCommentRequest.media_attachments && createCommentRequest.media_attachments.length !== 0) {
            await asyncForEach(createCommentRequest.media_attachments, async mediaAttachmentId => {
                const mediaAttachment = await this.mediaAttachmentsRepository.findById(mediaAttachmentId);

                if (!mediaAttachment) {
                    throw new HttpException(
                        `Could not find media attachment with id ${mediaAttachmentId}`,
                        HttpStatus.NOT_FOUND
                    )
                }

                mediaAttachments.push(mediaAttachment);
            })
        }

        let comment = this.commentsMapper.fromCreateCommentRequest({
            createCommentRequest,
            mediaAttachments,
            status,
            author: currentUser
        });
        comment = await this.commentsRepository.save(comment);

        return this.commentsMapper.toCommentResponse({
            comment
        })
    }

    public async findCommentsByStatus(statusId: string, paginationRequest: PaginationRequest): Promise<CommentResponse[]> {
        const status = await this.statusesRepository.findById(statusId);

        if (!status) {
            throw new HttpException(
                `Could not find status with id ${statusId}`,
                HttpStatus.NOT_FOUND
            )
        }

        return (await this.commentsRepository.findByStatus(status, paginationRequest))
            .map(comment => this.commentsMapper.toCommentResponse({comment}))
    }
}
