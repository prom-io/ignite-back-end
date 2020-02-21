import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MediaAttachmentsRepository} from "./MediaAttachmentsRepository";
import {MediaAttachmentsController} from "./MediaAttachmentsController";
import {MediaAttachmentsService} from "./MediaAttachmentsService";
import {MediaAttachmentsMapper} from "./MediaAttachmentsMapper";

@Module({
    controllers: [MediaAttachmentsController],
    providers: [MediaAttachmentsService, MediaAttachmentsMapper],
    imports: [
        TypeOrmModule.forFeature([MediaAttachmentsRepository])
    ],
    exports: [MediaAttachmentsMapper]
})
export class MediaAttachmentsModule {}
