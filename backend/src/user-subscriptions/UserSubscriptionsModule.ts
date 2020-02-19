import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserSubscriptionsRepository} from "./UserSubscriptionsRepository";
import {UserSubscriptionsService} from "./UserSubscriptionsService";
import {UserSubscriptionsMapper} from "./UserSubscriptionsMapper";
import {UsersModule} from "../users";
import {UsersRepository} from "../users/UsersRepository";
import {UserSubscriptionsController} from "./UserSubscriptionsController";

@Module({
    controllers: [UserSubscriptionsController],
    providers: [UserSubscriptionsService, UserSubscriptionsMapper],
    imports: [
        TypeOrmModule.forFeature([UserSubscriptionsRepository, UsersRepository]),
        forwardRef(() => UsersModule)
    ],
    exports: [UserSubscriptionsService, UserSubscriptionsMapper]
})
export class UserSubscriptionsModule {}
