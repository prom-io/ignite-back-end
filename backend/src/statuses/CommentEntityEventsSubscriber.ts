import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {LoggerService} from "nest-logger";
import {Connection, EntitySubscriberInterface, InsertEvent} from "typeorm";
import * as path from "path";
import {Comment} from "./entities";
import {BtfsCommentsMapper} from "../btfs-sync/mappers";
import {BtfsClient} from "../btfs-sync/BtfsClient";
import {config} from "../config";
import {asyncForEach} from "../utils/async-foreach";
import {IpAddressProvider} from "../btfs-sync/IpAddressProvider";
import {DefaultAccountProviderService} from "../default-account-provider/DefaultAccountProviderService";

@Injectable()
export class CommentEntityEventsSubscriber implements EntitySubscriberInterface<Comment> {
    constructor(@InjectConnection() private readonly connection: Connection,
                private readonly btfsCommentsMapper: BtfsCommentsMapper,
                private readonly btfsClient: BtfsClient,
                private readonly ipAddressProvider: IpAddressProvider,
                private readonly accountsService: DefaultAccountProviderService,
                private readonly log: LoggerService) {
        connection.subscribers.push(this);
    }

    // tslint:disable-next-line:ban-types
    public listenTo(): Function | string {
        return Comment;
    }

    public async afterInsert(event: InsertEvent<Comment>): Promise<void> {
        const comment = event.entity;

        if (!comment.btfsHash && config.ENABLE_BTFS_PUSHING) {
            await asyncForEach(comment.mediaAttachments, async mediaAttachment => {
                const filePath = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, mediaAttachment.name);
                try {
                    await this.btfsClient.uploadFile(mediaAttachment.id, filePath)
                } catch (error) {
                    this.log.error(`Error occurred when tried to save media attachment ${mediaAttachment.id} to BTFS`);
                    console.log(error);
                }
            })
        }

        this.log.info(`Saving comment with id ${comment.id} to BTFS`);
        this.btfsClient.saveComment({
            id: comment.id,
            data: this.btfsCommentsMapper.fromComment(comment),
            peerWallet: (await this.accountsService.getDefaultAccount()).address,
            peerIp: this.ipAddressProvider.getGlobalIpAddress(),
            commentId: comment.id,
            postId: comment.status.id
        })
            .then(() => this.log.info(`Comment with id ${comment.id} has been saved to BTFS`))
            .catch(error => {
                this.log.error(`Error occurred when tried to save comment with id ${comment.id} to BTFS`);
                console.log(error);
            })
    }
}
