import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {LoggerService} from "nest-logger";
import {Connection, EntitySubscriberInterface, InsertEvent, UpdateEvent} from "typeorm";
import {UserSubscription} from "./entities";
import {UserStatisticsRepository} from "../users/UserStatisticsRepository";
import {MicrobloggingBlockchainApiClient} from "../microblogging-blockchain-api";
import {BtfsUserSubscriptionsMapper} from "../btfs-sync/mappers";
import {IpAddressProvider} from "../btfs-sync/IpAddressProvider";
import {DefaultAccountProviderService} from "../default-account-provider/DefaultAccountProviderService";
import {config} from "../config";
import {BtfsKafkaClient} from "../btfs-sync/BtfsKafkaClient";
import {PushNotificationsService} from "../push-notifications/PushNotificationsService";

@Injectable()
export class UserSubscriptionEntityEventsSubscriber implements EntitySubscriberInterface<UserSubscription> {
    constructor(@InjectConnection() private readonly connection: Connection,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly btfsClient: BtfsKafkaClient,
                private readonly btfsUserSubscriptionsMapper: BtfsUserSubscriptionsMapper,
                private readonly ipAddressProvider: IpAddressProvider,
                private readonly accountService: DefaultAccountProviderService,
                private readonly pushNotificationService: PushNotificationsService,
                private readonly log: LoggerService) {
        connection.subscribers.push(this);
    }

    public listenTo() {
        return UserSubscription;
    }

    public async afterInsert(event: InsertEvent<UserSubscription>): Promise<void> {
        const {subscribedTo, subscribedUser} = event.entity;

        const subscribedToStatistics = await this.userStatisticsRepository.findByUser(subscribedTo);
        const subscribedUserStatistics = await this.userStatisticsRepository.findByUser(subscribedUser);

        subscribedToStatistics.followersCount = subscribedToStatistics.followersCount + 1;
        subscribedUserStatistics.followsCount = subscribedUserStatistics.followsCount + 1;

        await this.userStatisticsRepository.save(subscribedToStatistics);
        await this.userStatisticsRepository.save(subscribedUserStatistics);

        await this.pushNotificationService.processUserSubscription(event.entity);

        if (!event.entity.btfsHash && config.ENABLE_BTFS_PUSHING) {
            this.log.info("Saving user subscription to BTFS");

            if (!config.ENABLE_BTFS_PUSHING) {
                return;
            }

            this.btfsClient.saveUserSubscription({
                id: event.entity.id,
                userId: event.entity.subscribedUser.id,
                data: this.btfsUserSubscriptionsMapper.fromUserSubscription(event.entity),
                peerIp: this.ipAddressProvider.getGlobalIpAddress(),
                peerWallet: (await this.accountService.getDefaultAccount()).address
            })
                .then(() => this.log.info(`Subscription of ${subscribedUser.ethereumAddress} to ${subscribedTo.ethereumAddress} has been saved to BTFS`))
                .catch(error => {
                    this.log.error(`Error occurred when tried to save subscription of ${subscribedUser.ethereumAddress} to ${subscribedTo.ethereumAddress} to BTFS`);
                    console.log(error);
                })
        }
    }

    public async afterUpdate(event: UpdateEvent<UserSubscription>): Promise<void> {
        const subscription = event.entity;

        if (subscription.reverted && !subscription.btfsHash) {
            const {subscribedTo, subscribedUser} = event.entity;

            const subscribedToStatistics = await this.userStatisticsRepository.findByUser(subscribedTo);
            const subscribedUserStatistics = await this.userStatisticsRepository.findByUser(subscribedUser);

            subscribedToStatistics.followersCount = subscribedToStatistics.followersCount - 1;
            subscribedUserStatistics.followsCount = subscribedUserStatistics.followsCount - 1;

            await this.userStatisticsRepository.save(subscribedToStatistics);
            await this.userStatisticsRepository.save(subscribedUserStatistics);

            if (config.ENABLE_BTFS_PUSHING && event.entity.saveUnsubscriptionToBtfs) {
                if (!config.ENABLE_BTFS_PUSHING) {
                    return;
                }

                this.btfsClient.saveUserUnsubscription({
                    id: event.entity.id,
                    data: this.btfsUserSubscriptionsMapper.fromUserSubscription(event.entity),
                    peerIp: this.ipAddressProvider.getGlobalIpAddress(),
                    peerWallet: (await this.accountService.getDefaultAccount()).address,
                    userId: event.entity.subscribedUser.id
                })
                    .then(() => `Unsubscription on ${subscribedUser.ethereumAddress} from ${subscribedTo.ethereumAddress} has been saved to BTFS`)
                    .catch(error => {
                        this.log.error(`Error occurred when tried to save unsubscription of ${subscribedUser.ethereumAddress} from ${subscribedTo.ethereumAddress} to BTFS`);
                        console.log(error);
                    })
            }
        }
    }
}
