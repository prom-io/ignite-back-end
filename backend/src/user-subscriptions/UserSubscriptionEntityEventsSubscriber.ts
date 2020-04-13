import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {LoggerService} from "nest-logger";
import {Connection, EntitySubscriberInterface, InsertEvent, RemoveEvent} from "typeorm";
import {UserSubscription} from "./entities";
import {UserStatisticsRepository} from "../users/UserStatisticsRepository";
import {MicrobloggingBlockchainApiClient} from "../microblogging-blockchain-api";
import {BtfsUserSubscriptionsMapper} from "../btfs-sync/mappers";
import {BtfsClient} from "../btfs-sync/BtfsClient";
import {IpAddressProvider} from "../btfs-sync/IpAddressProvider";
import {DefaultAccountProviderService} from "../default-account-provider/DefaultAccountProviderService";

@Injectable()
export class UserSubscriptionEntityEventsSubscriber implements EntitySubscriberInterface<UserSubscription> {
    constructor(@InjectConnection() private readonly connection: Connection,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly microbloggingBlockchainApiClient: MicrobloggingBlockchainApiClient,
                private readonly btfsClient: BtfsClient,
                private readonly btfsUserSubscriptionsMapper: BtfsUserSubscriptionsMapper,
                private readonly ipAddressProvider: IpAddressProvider,
                private readonly accountService: DefaultAccountProviderService,
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

        if (!event.entity.btfsHash) {
            this.microbloggingBlockchainApiClient.logSubscription({
                id: event.entity.id,
                subscribeAt: event.entity.createdAt.toISOString(),
                user: event.entity.subscribedUser.ethereumAddress,
                whoSubscribe: event.entity.subscribedTo.ethereumAddress
            })
                .then(() => this.log.info(`Subscription of ${subscribedUser.ethereumAddress} to ${subscribedTo.ethereumAddress} has been written to blockchain`))
                .catch(error => {
                    this.log.error(`Error occurred when tried to write subscription of ${subscribedUser.ethereumAddress} to ${subscribedTo.ethereumAddress} to blockchain`);
                });
            this.log.info("Saving user subscription to BTFS");
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

    public async beforeRemove(event: RemoveEvent<UserSubscription>): Promise<void> {
        const {subscribedTo, subscribedUser, id} = event.entity;
        const subscribedToStatistics = await this.userStatisticsRepository.findByUser(subscribedTo);
        const subscribedUserStatistics = await this.userStatisticsRepository.findByUser(subscribedUser);

        subscribedToStatistics.followersCount = subscribedToStatistics.followersCount - 1;
        subscribedUserStatistics.followsCount = subscribedUserStatistics.followsCount - 1;

        await this.userStatisticsRepository.save(subscribedToStatistics);
        await this.userStatisticsRepository.save(subscribedUserStatistics);

        if (event.entity.saveUnsubscriptionToBtfs) {
            this.microbloggingBlockchainApiClient.logUnsubscription({
                id: event.entity.id,
                user: subscribedUser.ethereumAddress
            })
                .then(() => this.log.info(`Unsubscription of ${subscribedUser.ethereumAddress} from ${subscribedTo.ethereumAddress} has been written to blockchain`))
                .catch(error => {
                    this.log.error(`Error occurred when tried to write unsubscription of ${subscribedUser.ethereumAddress} from ${subscribedTo.ethereumAddress} to blockchain`);
                    console.error(error);
                });
            this.btfsClient.saveUserUnsubscription({
                id: event.entity.id,
                data: this.btfsUserSubscriptionsMapper.fromUserSubscription(event.entity),
                peerIp: this.ipAddressProvider.getGlobalIpAddress(),
                peerWallet: (await this.accountService.getDefaultAccount()).address
            })
                .then(() => `Unsubscription on ${subscribedUser.ethereumAddress} from ${subscribedTo.ethereumAddress} has been saved to BTFS`)
                .catch(error => {
                    this.log.error(`Error occurred when tried to save unsubscription of ${subscribedUser.ethereumAddress} from ${subscribedTo.ethereumAddress} to BTFS`);
                    console.log(error);
                })
        }
    }
}
