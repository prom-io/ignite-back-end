import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {FeedController} from "./FeedController";
import {FeedService} from "./FeedService";
import {StatusesController} from "./StatusesController";
import {StatusesService} from "./StatusesService";
import {StatusesMapper} from "./StatusesMapper";
import {StatusesRepository} from "./StatusesRepository";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {StatusLikesService} from "./StatusLikesService";
import {UsersModule} from "../users";
import {UsersRepository} from "../users/UsersRepository";
import {UserSubscriptionsModule, UserSubscriptionsRepository} from "../user-subscriptions";

@Module({
    controllers: [StatusesController, FeedController],
    providers: [StatusesService, StatusesMapper, StatusLikesService, FeedService],
    imports: [
        TypeOrmModule.forFeature([StatusesRepository, StatusLikesRepository, UsersRepository, UserSubscriptionsRepository]),
        forwardRef(() => UsersModule),
        UserSubscriptionsModule
    ],
    exports: [StatusesService, StatusesMapper]
})
export class StatusesModule {}
