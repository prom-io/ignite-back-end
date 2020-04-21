import {Global, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ScheduleModule} from "nest-schedule";
import Axios from "axios";
import {BtfsController} from "./BtfsController";
import {BtfsService} from "./BtfsService";
import {BtfsHashRepository} from "./BtfsHashRepository";
import {
    BtfsHashesMapper,
    BtfsMediaAttachmentsMapper,
    BtfsStatusesMapper,
    BtfsStatusLikesMapper,
    BtfsUsersMapper,
    BtfsUserSubscriptionsMapper
} from "./mappers";
import {IpAddressProvider} from "./IpAddressProvider";
import {BtfsSynchronizer} from "./BtfsSynchronizer";
import {BtfsClient} from "./BtfsClient";
import {UsersRepository} from "../users/UsersRepository";
import {StatusesRepository} from "../statuses/StatusesRepository";
import {StatusLikesRepository} from "../statuses/StatusLikesRepository";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {MediaAttachmentsRepository} from "../media-attachments/MediaAttachmentsRepository";
import {config} from "../config";
import {CommentsRepository} from "../statuses/CommentsRepository";

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
        BtfsMediaAttachmentsMapper,
        IpAddressProvider,
        BtfsHashesMapper,
        IpAddressProvider
    ],
    imports: [
        TypeOrmModule.forFeature([
            BtfsHashRepository,
            UsersRepository,
            StatusesRepository,
            StatusLikesRepository,
            UserSubscriptionsRepository,
            MediaAttachmentsRepository,
            CommentsRepository
        ]),
        ScheduleModule.register()
    ],
    exports: [
        BtfsClient,
        BtfsUsersMapper,
        BtfsUserSubscriptionsMapper,
        BtfsStatusLikesMapper,
        BtfsStatusesMapper,
        BtfsMediaAttachmentsMapper,
        IpAddressProvider,
        BtfsHashesMapper
    ]
})
export class BtfsModule {}
