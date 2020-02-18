import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities";
import {UsersService} from "./UsersService";
import {UsersMapper} from "./UsersMapper";
import {UsersController} from "./UsersController";

@Module({
    controllers: [UsersController],
    providers: [UsersService, UsersMapper],
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    exports: [UsersService]
})
export class UsersModule {}
