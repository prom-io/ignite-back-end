import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {LoggerService} from "nest-logger";
import {Connection, EntitySubscriberInterface, InsertEvent} from "typeorm";
import uuid from "uuid/v4";
import {User, UserStatistics} from "./entities";
import {BtfsKafkaClient} from "../btfs-sync/BtfsKafkaClient";
import {BtfsUsersMapper} from "../btfs-sync/mappers";
import {IpAddressProvider} from "../btfs-sync/IpAddressProvider";
import {DefaultAccountProviderService} from "../default-account-provider/DefaultAccountProviderService";
import {config} from "../config";

@Injectable()
export class UserEntityEventsSubscriber implements EntitySubscriberInterface<User> {
    constructor(@InjectConnection() private readonly connection: Connection,
                private readonly btfsKafkaClient: BtfsKafkaClient,
                private readonly btfsUserMapper: BtfsUsersMapper,
                private readonly ipAddressProvider: IpAddressProvider,
                private readonly defaultAccountProviderService: DefaultAccountProviderService,
                private readonly log: LoggerService) {
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

        if (config.ENABLE_BTFS_PUSHING) {
            this.log.info(`Saving user ${event.entity.id} to BTFS`);
            this.btfsKafkaClient.saveUser({
                peerIp: this.ipAddressProvider.getGlobalIpAddress(),
                peerWallet: (await this.defaultAccountProviderService.getDefaultAccount()).address,
                id: event.entity.id,
                userId: event.entity.id,
                data: this.btfsUserMapper.fromUser(event.entity)
            })
                .then(() => this.log.info(`User ${event.entity.id} has been saved to BTFS`))
                .catch(error => {
                    this.log.error(`Error occurred when tried to save user ${event.entity.id} to BTFS`);
                    console.log(error);
                })
        }
    }
}
