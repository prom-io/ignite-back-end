import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ScheduleModule} from "nest-schedule";
import {MediaAttachmentsRepository} from "./MediaAttachmentsRepository";
import {SiaSynchronizer} from "./SiaSynchronizer";
import {SkynetModule} from "../skynet";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MediaAttachmentsRepository
        ]),
        SkynetModule,
        ScheduleModule.register()
    ],
    providers: [SiaSynchronizer]
})
export class SiaSynchronizerModule {
    
}
