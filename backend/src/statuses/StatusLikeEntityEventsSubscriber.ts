import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {LoggerService} from "nest-logger";
import {Connection, EntitySubscriberInterface, InsertEvent, UpdateEvent} from "typeorm";
import {StatusLike} from "./entities";
import {MicrobloggingBlockchainApiClient} from "../microblogging-blockchain-api";
import {BtfsStatusLikesMapper} from "../btfs-sync/mappers";
import {IpAddressProvider} from "../btfs-sync/IpAddressProvider";
import {DefaultAccountProviderService} from "../default-account-provider/DefaultAccountProviderService";
import {config} from "../config";
import {BtfsKafkaClient} from "../btfs-sync/BtfsKafkaClient";

@Injectable()
export class StatusLikeEntityEventsSubscriber implements EntitySubscriberInterface<StatusLike> {
    constructor(@InjectConnection() private readonly connection: Connection,
                private readonly microbloggingBlockchainApiClient: MicrobloggingBlockchainApiClient,
                private readonly btfsClient: BtfsKafkaClient,
                private readonly btfsStatusLikesMapper: BtfsStatusLikesMapper,
                private readonly accountService: DefaultAccountProviderService,
                private readonly ipAddressProvider: IpAddressProvider,
                private readonly log: LoggerService) {
        connection.subscribers.push(this);
    }

    public listenTo() {
        return StatusLike;
    }

    public async afterInsert(event: InsertEvent<StatusLike>): Promise<void> {
        const statusLike = event.entity;

        if (!statusLike.btfsHash) {
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
                });
            this.log.info("Saving status like to BTFS");

            if (!config.ENABLE_BTFS_PUSHING) {
                return ;
            }

            this.btfsClient.saveStatusLike({
                commentId: statusLike.status.id,
                id: statusLike.id,
                peerIp: this.ipAddressProvider.getGlobalIpAddress(),
                peerWallet: (await this.accountService.getDefaultAccount()).address,
                data: this.btfsStatusLikesMapper.fromStatusLike(statusLike)
            })
                .then(() => this.log.info(`Like of ${statusLike.user.ethereumAddress} to status ${statusLike.status.id} has been written to BTFS`))
                .catch(error => {
                    this.log.error(`Error occurred when tried to write like of ${statusLike.user.ethereumAddress} to status ${statusLike.status.id} to BTFS`);
                    console.error(error);
                })
        }
    }

    public async afterUpdate(event: UpdateEvent<StatusLike>): Promise<void> {
        const statusLike = event.entity;

        this.log.info("Logging status unlike to blockchain");

        if (statusLike.reverted && statusLike.saveUnlikeToBtfs && config.ENABLE_BTFS_PUSHING) {
            this.microbloggingBlockchainApiClient.logStatusUnlike({
                id: statusLike.id,
                messageId: statusLike.status.id,
                user: statusLike.user.ethereumAddress
            })
                // tslint:disable-next-line:max-line-length
                .then(() => this.log.info(`Unlike of ${statusLike.user.ethereumAddress} to status ${statusLike.status.id} has been written to blockchain`))
                .catch(error => {
                    this.log.error(`Error occurred when tried to write unlike of ${statusLike.user.ethereumAddress} to status ${statusLike.status.id} to blockchain client`);
                    console.error(error);
                });

            if (!config.ENABLE_BTFS_PUSHING) {
                return ;
            }

            this.btfsClient.saveStatusUnlike({
                commentId: statusLike.status.id,
                id: statusLike.id,
                peerIp: this.ipAddressProvider.getGlobalIpAddress(),
                peerWallet: (await this.accountService.getDefaultAccount()).address,
                data: this.btfsStatusLikesMapper.fromStatusLike(statusLike)
            })
                .then(() => this.log.info(`Unlike of ${statusLike.user.ethereumAddress} to status ${statusLike.status.id} has been written to BTFS`))
                .catch(error => {
                    this.log.error(`Error occurred when trued to write unlike of ${statusLike.user.ethereumAddress} to status ${statusLike.status.id} to BTFS`);
                    console.log(error);
                })
        }
    }
}
