import {Module, Global} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ScheduleModule} from "nest-schedule";
import {BtfsController} from "./BtfsController";
import {BtfsService} from "./BtfsService";
import {BtfsHashRepository} from "./BtfsHashRepository";
import {UsersRepository} from "../users";
import {StatusesRepository, StatusLikesRepository} from "../statuses";
import {UserSubscriptionsRepository} from "../user-subscriptions";
import {BtfsSynchronizer} from "./BtfsSynchronizer";
import {MediaAttachmentsRepository} from "../media-attachments/MediaAttachmentsRepository";

@Global()
@Module({
    controllers: [BtfsController],
    providers: [BtfsService, BtfsSynchronizer],
    imports: [
        TypeOrmModule.forFeature([
            BtfsHashRepository,
            UsersRepository,
            StatusesRepository,
            StatusLikesRepository,
            UserSubscriptionsRepository,
            MediaAttachmentsRepository
        ]),
        ScheduleModule.register()
    ]
})
export class BtfsModule {}
