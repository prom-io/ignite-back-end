import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {LoggerService} from "nest-logger";
import {Connection, EntitySubscriberInterface, InsertEvent} from "typeorm";
import path from "path";
import {Status} from "./entities";
import {UserStatisticsRepository} from "../users";
import {MicrobloggingBlockchainApiClient} from "../microblogging-blockchain-api";
import {BtfsHttpClient} from "../btfs-sync/BtfsHttpClient";
import {BtfsStatusesMapper} from "../btfs-sync/mappers";
import {asyncForEach} from "../utils/async-foreach";
import {config} from "../config";
import {IpAddressProvider} from "../btfs-sync/IpAddressProvider";
import {DefaultAccountProviderService} from "../default-account-provider/DefaultAccountProviderService";
import {BtfsKafkaClient} from "../btfs-sync/BtfsKafkaClient";

@Injectable()
export class StatusEntityEventsSubscriber implements EntitySubscriberInterface<Status> {
    constructor(@InjectConnection() private readonly connection: Connection,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly microbloggingBlockchainApiClient: MicrobloggingBlockchainApiClient,
                private readonly btfsClient: BtfsKafkaClient,
                private readonly btfsHttpClient: BtfsHttpClient,
                private readonly btfsStatusesMapper: BtfsStatusesMapper,
                private readonly accountService: DefaultAccountProviderService,
                private readonly ipAddressProvider: IpAddressProvider,
                private readonly log: LoggerService) {
        connection.subscribers.push(this);
    }

    public listenTo() {
        return Status;
    }

    public async afterInsert(event: InsertEvent<Status>): Promise<void> {
        const author = event.entity.author;
        const userStatistics = await this.userStatisticsRepository.findByUser(author);
        userStatistics.statusesCount += 1;
        await this.userStatisticsRepository.save(userStatistics);

        if (!event.entity.btfsHash) {
            this.log.info("Logging status to blockchain");
            this.microbloggingBlockchainApiClient.logStatus({
                id: event.entity.id,
                address: author.ethereumAddress,
                createdAt: event.entity.createdAt.toISOString(),
                text: event.entity.text
            })
                .then(() => {
                    this.log.info(`Status ${event.entity.id} has been written to blockchain`)
                })
                .catch(error => {
                    this.log.error("Error occurred when tried to write status to blockchain");
                    console.error(error);
                });

            if (!config.ENABLE_BTFS_PUSHING) {
                return ;
            }

            await asyncForEach(event.entity.mediaAttachments, async mediaAttachment => {
                const filePath = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, mediaAttachment.name);
                try {
                    await this.btfsHttpClient.uploadFile(mediaAttachment.id, filePath);
                    this.log.info(`Media attachment ${mediaAttachment.id} has been saved to BTFS`);
                } catch (error) {
                    this.log.error(`Error occurred when tried to save media attachment ${mediaAttachment.id} to BTFS`);
                    console.log(error);
                }
            });
            this.btfsClient.saveStatus({
                id: event.entity.id,
                data: this.btfsStatusesMapper.fromStatus(event.entity),
                peerIp: this.ipAddressProvider.getGlobalIpAddress(),
                peerWallet: (await this.accountService.getDefaultAccount()).address
            })
                .then(() => this.log.info(`Status ${event.entity.id} has been saved to BTFS`))
                .catch(error => {
                    this.log.error(`Error occurred when tried to write status ${event.entity.id} to BTFS`);
                    console.log(error);
                })
        }
    }
}
