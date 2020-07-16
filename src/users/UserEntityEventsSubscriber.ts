import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {LoggerService} from "nest-logger";
import {Connection, EntitySubscriberInterface, InsertEvent} from "typeorm";
import {User} from "./entities";
import {SignUpReferencesRepository} from "./SignUpReferencesRepository";
import {UsersRepository} from "./UsersRepository";
import {BtfsKafkaClient} from "../btfs-sync/BtfsKafkaClient";
import {BtfsUsersMapper} from "../btfs-sync/mappers";
import {IpAddressProvider} from "../btfs-sync/IpAddressProvider";
import {DefaultAccountProviderService} from "../default-account-provider/DefaultAccountProviderService";
import {config} from "../config";

@Injectable()
export class UserEntityEventsSubscriber implements EntitySubscriberInterface<User> {
    constructor(@InjectConnection() private readonly connection: Connection,
                private readonly signUpReferencesRepository: SignUpReferencesRepository,
                private readonly usersRepository: UsersRepository,
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
        if (event.entity.signUpReference) {
            const user = event.entity;
            this.usersRepository.countBySignUpReference(user.signUpReference)
                .then(async usersCount => {
                    const signUpReference = user.signUpReference;
                    signUpReference.registeredUsersCount = usersCount + 1;
                    await this.signUpReferencesRepository.save(signUpReference);
                })
        }

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
