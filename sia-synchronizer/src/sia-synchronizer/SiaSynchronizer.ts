import {Injectable} from "@nestjs/common";
import {Cron, NestSchedule} from "nest-schedule";
import {LoggerService} from "nest-logger";
import path from "path";
import {MediaAttachmentsRepository} from "./MediaAttachmentsRepository";
import {SkynetClient} from "../skynet";
import {sleep} from "../utils/sleep";

@Injectable()
export class SiaSynchronizer extends NestSchedule {
    private running: boolean = false;

    constructor(private readonly mediaAttachmentsRepository: MediaAttachmentsRepository,
                private readonly skynetClient: SkynetClient,
                private readonly log: LoggerService) {
        super();
    }

    @Cron("*/30 * * * *", {waiting: true, immediate: true})
    public async uploadImagesToSia(): Promise<void> {
        this.log.info("Attempting to synchronize images which have not been uploaded to SIA");
        if (this.running) {
            this.log.info("Synchronization with sia is already running");
            return;
        }
        
        const notUploadedImages = await this.mediaAttachmentsRepository.findNotUploadedToSia();
        let successfullyUploadedImages = 0;
        let failedImages = 0;

        this.log.info(`Found ${notUploadedImages.length} media attachments which have not been uploaded to SIA`);

        for (let index = 0; index < notUploadedImages.length; index++) {
            const mediaAttachment = notUploadedImages[index];

            try {
                this.log.info(`Uploading media attachment with id ${mediaAttachment.id}`);
                const filePath = path.join(process.env.MEDIA_ATTACHMENTS_DIRECTORY, `${mediaAttachment.id}.${mediaAttachment.format}`);
                const siaLink = await this.skynetClient.uploadFile(filePath);
                this.log.info(`Media attachment ${mediaAttachment.id} has been successfully uploaded to SIA`);
                this.log.info(`Received SIA link is ${siaLink}`);
                mediaAttachment.siaLink = siaLink;
                await this.mediaAttachmentsRepository.save(mediaAttachment);
                successfullyUploadedImages++;
            } catch (error) {
                this.log.error(`Error occurred when tried to upload media attachment ${mediaAttachment.id} to SIA`);
                console.log(error);
                failedImages++;
            }

            this.log.info(`Processed ${index + 1} media attachments out of ${notUploadedImages.length}`);
            await sleep(600);
        }

        this.log.info("Synchronization with SIA has been completed");
        this.log.info(`Processed ${notUploadedImages.length} images`);
        this.log.info(`Number of images which have been uploaded successfully is ${successfullyUploadedImages}`);
        this.log.info(`Number of failed images is ${failedImages}`);

        this.running = false;
    }
}
