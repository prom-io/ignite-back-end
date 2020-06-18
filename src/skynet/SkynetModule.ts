import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ScheduleModule} from "nest-schedule";
import {SkynetClient} from "./SkynetClient";
import {SkynetImagesScheduledUploader} from "./SkynetImagesScheduledUploader";
import {MediaAttachmentsRepository} from "../media-attachments/MediaAttachmentsRepository";

@Module({
    providers: [SkynetClient, SkynetImagesScheduledUploader],
    exports: [SkynetClient],
    imports: [
        TypeOrmModule.forFeature([MediaAttachmentsRepository]),
        ScheduleModule.register()
    ]
})
export class SkynetModule {
}
