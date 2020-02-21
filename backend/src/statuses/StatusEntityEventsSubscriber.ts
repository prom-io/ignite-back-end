import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {LoggerService} from "nest-logger";
import {Connection, EntitySubscriberInterface, InsertEvent} from "typeorm";
import {Status} from "./entities";
import {UserStatisticsRepository} from "../users";
import {MicrobloggingBlockchainApiClient} from "../microblogging-blockchain-api";

@Injectable()
export class StatusEntityEventsSubscriber implements EntitySubscriberInterface<Status> {
    constructor(@InjectConnection() private readonly connection: Connection,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly microbloggingBlockchainApiClient: MicrobloggingBlockchainApiClient,
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

        this.log.info("Logging status to blockchain");
        this.microbloggingBlockchainApiClient.logStatus({
            id: event.entity.id,
            address: author.ethereumAddress,
            createdAt: event.entity.createdAt.toISOString(),
            text: event.entity.text
        })
            .then(response => {
                this.log.info(`Status ${event.entity.id} has been written to blockchain`)
            })
            .catch(error => {
                this.log.error("Error occurred when tried to write status to blockchain");
                console.error(error);
            })
    }
}
