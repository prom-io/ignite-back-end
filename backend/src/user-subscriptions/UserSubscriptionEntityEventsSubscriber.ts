import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection, EntitySubscriberInterface, InsertEvent, RemoveEvent} from "typeorm";
import {UserSubscription} from "./entities";
import {UserStatisticsRepository} from "../users";

@Injectable()
export class UserSubscriptionEntityEventsSubscriber implements EntitySubscriberInterface<UserSubscription> {
    constructor(@InjectConnection() private readonly connection: Connection,
                private readonly userStatisticsRepository: UserStatisticsRepository) {
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
        subscribedUserStatistics.followsCount = subscribedToStatistics.followsCount + 1;

        await this.userStatisticsRepository.save(subscribedToStatistics);
        await this.userStatisticsRepository.save(subscribedUserStatistics);
    }

    public async afterRemove(event: RemoveEvent<UserSubscription>): Promise<void> {
        const {subscribedTo, subscribedUser} = event.entity;

        const subscribedToStatistics = await this.userStatisticsRepository.findByUser(subscribedTo);
        const subscribedUserStatistics = await this.userStatisticsRepository.findByUser(subscribedUser);

        subscribedToStatistics.followersCount = subscribedToStatistics.followsCount - 1;
        subscribedUserStatistics.followsCount = subscribedUserStatistics.followsCount - 1;

        await this.userStatisticsRepository.save(subscribedToStatistics);
        await this.userStatisticsRepository.save(subscribedUserStatistics);
    }
}
