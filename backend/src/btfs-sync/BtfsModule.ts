import {Module, Global} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ScheduleModule} from "nest-schedule";
import Axios from "axios";
import {BtfsController} from "./BtfsController";
import {BtfsService} from "./BtfsService";
import {BtfsHashRepository} from "./BtfsHashRepository";
import {UsersRepository} from "../users";
import {StatusesRepository, StatusLikesRepository} from "../statuses";
import {UserSubscriptionsRepository} from "../user-subscriptions";
import {BtfsSynchronizer} from "./BtfsSynchronizer";
import {MediaAttachmentsRepository} from "../media-attachments/MediaAttachmentsRepository";
import {BtfsClient} from "./BtfsClient";
import {config} from "../config";
import {BtfsMediaAttachmentsMapper, BtfsStatusesMapper, BtfsStatusLikesMapper, BtfsUsersMapper, BtfsUserSubscriptionsMapper} from "./mappers";

@Global()
@Module({
    controllers: [BtfsController],
    providers: [
        {
            provide: "btfsAxios",
            useValue: Axios.create({
                baseURL: config.BTFS_API_BASE_URL
            })
        },
        BtfsService,
        BtfsSynchronizer,
        BtfsClient,
        BtfsUsersMapper,
        BtfsUserSubscriptionsMapper,
        BtfsStatusLikesMapper,
        BtfsStatusesMapper,
        BtfsMediaAttachmentsMapper
    ],
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
    ],
    exports: [
        BtfsClient,
        BtfsUsersMapper,
        BtfsUserSubscriptionsMapper,
        BtfsStatusLikesMapper,
        BtfsStatusesMapper,
        BtfsMediaAttachmentsMapper
    ]
})
export class BtfsModule {}
