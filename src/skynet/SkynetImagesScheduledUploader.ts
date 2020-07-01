import {Injectable} from "@nestjs/common";
import {Cron, NestSchedule} from "nest-schedule";
import {LoggerService} from "nest-logger";
import {PathLike} from "fs";
import path from "path";
import {SkynetClient} from "./SkynetClient";
import {MediaAttachmentsRepository} from "../media-attachments/MediaAttachmentsRepository";
import {asyncForEach} from "../utils/async-foreach";
import {config} from "../config";
import {isDebug} from "../utils/is-debug";
import {sleep} from "../utils/sleep";
import {asyncMap} from "../utils/async-map";

@Injectable()
export class SkynetImagesScheduledUploader extends NestSchedule {
    private running: boolean = false;

    constructor(private readonly mediaAttachmentsRepository: MediaAttachmentsRepository,
                private readonly skynetClient: SkynetClient,
                private readonly log: LoggerService) {
        super();
    }

    @Cron("*/10 * * * *", {waiting: true})
    public async lookForImagesNotUploadedToSiaSkynet(): Promise<void> {
        if (this.running || !config.ENABLE_UPLOADING_IMAGES_TO_SIA){
            return;
        }

        this.running = true;

        this.log.info("Looking for images not uploaded to Sia Skynet");
        const notUploadedMediaAttachments = await this.mediaAttachmentsRepository.find({
            where: {
                siaLink: null
            },
            take: 50
        });

        await asyncMap(notUploadedMediaAttachments, async mediaAttachment => {
            const filePath: PathLike = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, `${mediaAttachment.id}.${mediaAttachment.format}`);
            try {
                await sleep(1000); // Give some rest to Sia Skynet to avoid "Too many requests" error
                this.log.debug(`Uploading media attachment with id ${mediaAttachment.id}`);
                const siaLink = await this.skynetClient.uploadFile(filePath);
                this.log.debug(`Media attachment with id ${mediaAttachment.id} has been uploaded, received siaLink is ${siaLink}`);

                mediaAttachment.siaLink = siaLink;
                return this.mediaAttachmentsRepository.save(mediaAttachment);
            } catch (error) {
                this.log.error(`Error occurred when tried to upload media attachment with id ${mediaAttachment.id}`, error.stack);

                if (isDebug(config.LOGGING_LEVEL)) {
                    console.log(error);
                }
            }
        });

        this.running = false;
    }
}
