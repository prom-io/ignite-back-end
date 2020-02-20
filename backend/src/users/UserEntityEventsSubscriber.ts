import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection, EntitySubscriberInterface, InsertEvent} from "typeorm";
import uuid from "uuid/v4";
import {User, UserStatistics} from "./entities";

@Injectable()
export class UserEntityEventsSubscriber implements EntitySubscriberInterface<User> {
    constructor(@InjectConnection() private readonly connection: Connection) {
        connection.subscribers.push(this);
    }

    public listenTo() {
        return User;
    }

    public async afterInsert(event: InsertEvent<User>): Promise<void> {
        const userStatistics: UserStatistics = {
            id: uuid(),
            followsCount: 0,
            followersCount: 0,
            statusesCount: 0,
            user: event.entity
        };
        await event.manager.getRepository(UserStatistics).save(userStatistics);
    }
}
