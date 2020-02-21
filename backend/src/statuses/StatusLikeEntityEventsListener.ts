import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {LoggerService} from "nest-logger";
import {Connection, EntitySubscriberInterface, InsertEvent, RemoveEvent} from "typeorm";
import {StatusLike} from "./entities";
import {MicrobloggingBlockchainApiClient} from "../microblogging-blockchain-api";

@Injectable()
export class StatusLikeEntityEventsListener implements EntitySubscriberInterface<StatusLike> {
    constructor(@InjectConnection() private readonly connection: Connection,
                private readonly microbloggingBlockchainApiClient: MicrobloggingBlockchainApiClient,
                private readonly log: LoggerService) {
        connection.subscribers.push(this);
    }

    public listenTo() {
        return StatusLike;
    }

    public async afterInsert(event: InsertEvent<StatusLike>): Promise<void> {
        const statusLike = event.entity;

        this.log.info("Logging status like to blockchain");
        this.microbloggingBlockchainApiClient.logStatusLike({
            id: statusLike.id,
            user: statusLike.user.ethereumAddress,
            likedAt: statusLike.createdAt.toISOString(),
            messageId: statusLike.status.id
        })
            .then(() => this.log.info(`Like of ${statusLike.user.ethereumAddress} to status ${statusLike.status.id} has been written to blockchain`))
            .catch(error => {
                this.log.error(`Error occurred when tried to write like of ${statusLike.user.ethereumAddress} to status ${statusLike.status.id} to blockchain`);
                console.error(error);
            })
    }

    public async afterRemove(event: RemoveEvent<StatusLike>): Promise<void> {
        const statusLike = event.entity;

        this.log.info("Logging status unlike to blockchain");
        this.microbloggingBlockchainApiClient.logStatusUnlike({
            id: statusLike.status.id,
            messageId: statusLike.status.id,
            user: statusLike.user.ethereumAddress
        })
            // tslint:disable-next-line:max-line-length
            .then(() => this.log.info(`Unlike of ${statusLike.user.ethereumAddress} to status ${statusLike.status.id} has been written to blockchain`))
            .catch(error => {
                this.log.error(`Error occurred when tried to write unlike of ${statusLike.user.ethereumAddress} to status ${statusLike.status.id} to blockchain client`);
                console.error(error);
            })
    }
}
