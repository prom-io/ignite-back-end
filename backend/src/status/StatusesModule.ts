import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {StatusesController} from "./StatusesController";
import {StatusesService} from "./StatusesService";
import {StatusesMapper} from "./StatusesMapper";
import {StatusesRepository} from "./StatusesRepository";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {UsersModule} from "../users";
import {UsersRepository} from "../users/UsersRepository";

@Module({
    controllers: [StatusesController],
    providers: [StatusesService, StatusesMapper],
    imports: [
        TypeOrmModule.forFeature([StatusesRepository, StatusLikesRepository, UsersRepository]),
        forwardRef(() => UsersModule)
    ],
    exports: [StatusesService]
})
export class StatusesModule {}
