import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersService} from "./UsersService";
import {UsersMapper} from "./UsersMapper";
import {UsersController} from "./UsersController";
import {UsersRepository} from "./UsersRepository";
import {StatusesModule} from "../statuses";
import {UserSubscriptionsModule} from "../user-subscriptions";

@Module({
    controllers: [UsersController],
    providers: [UsersService, UsersMapper],
    imports: [
        TypeOrmModule.forFeature([UsersRepository]),
        forwardRef(() => StatusesModule),
        forwardRef(() => UserSubscriptionsModule)
    ],
    exports: [UsersService, UsersMapper]
})
export class UsersModule {}
