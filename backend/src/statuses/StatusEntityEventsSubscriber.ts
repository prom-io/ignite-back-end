import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection, EntitySubscriberInterface, InsertEvent} from "typeorm";
import {Status} from "./entities";
import {UserStatisticsRepository} from "../users";

@Injectable()
export class StatusEntityEventsSubscriber implements EntitySubscriberInterface<Status> {
    constructor(@InjectConnection() private readonly connection: Connection,
                private readonly userStatisticsRepository: UserStatisticsRepository) {
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
    }
}
