import {HttpException, HttpStatus, Injectable, BadRequestException} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import {Response} from "express";
import {promisify} from "util"
import fileSystem from "fs";
import path from "path";
import graphicsMagic, { Dimensions } from "gm";
import FileTypeExtractor from "file-type";
import uuid from "uuid/v4";
import {MediaAttachmentsRepository} from "./MediaAttachmentsRepository";
import {MediaAttachmentResponse, MultipartFile} from "./types";
import {MediaAttachment} from "./entities";
import {MediaAttachmentsMapper} from "./MediaAttachmentsMapper";
import {config} from "../config";
import {SkynetClient} from "../skynet";
import {exists} from "../utils/file-utils"

const gm = graphicsMagic.subClass({imageMagick: true});

@Injectable()
export class MediaAttachmentsService {
    constructor(private readonly mediaAttachmentRepository: MediaAttachmentsRepository,
                private readonly mediaAttachmentsMapper: MediaAttachmentsMapper,
                private readonly skynetClient: SkynetClient,
                private readonly log: LoggerService) {
    }

    public async saveMediaAttachment(multipartFile: MultipartFile): Promise<MediaAttachmentResponse> {
        const id = uuid();
        const temporaryFilePath = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, `${id}.temporary`);
        await fileSystem.promises.writeFile(temporaryFilePath, multipartFile.buffer)

        const fileTypeResult = await FileTypeExtractor.fromBuffer(multipartFile.buffer);

        if (!fileTypeResult.mime.startsWith("image")) {
            throw new BadRequestException("file is not an image");
        }

        const size = await this.getImageSize(temporaryFilePath)

        const permanentFilePath = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, `${id}.${fileTypeResult.ext}`);
        await fileSystem.promises.rename(temporaryFilePath, permanentFilePath)

        const mediaAttachment: MediaAttachment = {
            id,
            format: fileTypeResult.ext,
            mimeType: fileTypeResult.mime,
            height: size.height,
            width: size.width,
            name: `${id}.${fileTypeResult.ext}`,
            siaLink: null,
            ...await this.generateMediaAttachmentPreviews(permanentFilePath, fileTypeResult, size)
        };

        await this.mediaAttachmentRepository.save(mediaAttachment);

        if (config.ENABLE_UPLOADING_IMAGES_TO_SIA) {
            [
                mediaAttachment,
                mediaAttachment.preview128,
                mediaAttachment.preview256,
                mediaAttachment.preview512,
                mediaAttachment.preview1024
            ].forEach(mediaAttachmentOrPreview => {
                if (mediaAttachmentOrPreview) {
                    // do not await, cuz the execution can take several seconds
                    this.uploadMediaAttachmentToSkynet(mediaAttachmentOrPreview)
                }
            })
        }

        return this.mediaAttachmentsMapper.toMediaAttachmentResponse(mediaAttachment);
    }

    public async getMediaAttachmentByName(name: string, response: Response): Promise<void> {
        const mediaAttachment = await this.mediaAttachmentRepository.findByName(name);

        if (!mediaAttachment) {
            throw new HttpException(`Could not find ${name}`, HttpStatus.NOT_FOUND)   }

        const fileExists = await exists(path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, name));

        if (fileExists) {
            response.header("Content-Type", mediaAttachment.mimeType);
            fileSystem.createReadStream(path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, name)).pipe(response);
        } else {
            await this.skynetClient.downloadFile(path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, name), mediaAttachment.siaLink);
            response.header("Content-Type", mediaAttachment.mimeType);
            fileSystem.createReadStream(path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, name)).pipe(response);
        }
    }

    private async generateMediaAttachmentPreviews(
        imagePath: string,
        fileTypeResult: FileTypeExtractor.FileTypeResult,
        size: Dimensions,
    ): Promise<Pick<MediaAttachment, "preview128" | "preview256" | "preview512" | "preview1024">> {
        const [preview128, preview256, preview512, preview1024] = await Promise.all(
            [128, 256, 512, 1024].map(
                async previewDimension => {
                    return size.height > previewDimension || size.width > previewDimension
                        ? await this.generateMediaAttachmentPreview(imagePath, fileTypeResult, previewDimension)
                        : null
                }
            )
        )

        return { preview128, preview256, preview512, preview1024 }
    }

    private async generateMediaAttachmentPreview(
        imagePath: string,
        fileTypeResult: FileTypeExtractor.FileTypeResult,
        maxDimension: number,
    ): Promise<MediaAttachment> {
        const id = uuid()
        const previewPath = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, `${id}.${fileTypeResult.ext}`)

        const gmInstance = gm(imagePath).resize(maxDimension, maxDimension)
        await promisify(gmInstance.write.bind(gmInstance))(previewPath)

        const previewSize = await this.getImageSize(previewPath)

        return {
            id,
            format: fileTypeResult.ext,
            mimeType: fileTypeResult.mime,
            height: previewSize.height,
            width: previewSize.width,
            name: `${id}.${fileTypeResult.ext}`,
            siaLink: null
        }
    }

    private async getImageSize(imagePath: string): Promise<Dimensions> {
        const gmState = gm(imagePath)

        return promisify(gmState.size.bind(gmState))()
    }

    private async uploadMediaAttachmentToSkynet(mediaAttachment: MediaAttachment): Promise<void> {
        const filePath = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, `${mediaAttachment.id}.${mediaAttachment.format}`);

        return this.skynetClient.uploadFile(filePath)
            .then(async siaLink => {
                this.log.info(`Media attachment ${mediaAttachment.name} has been uploaded to SIA`);
                this.log.debug(`Media attachment ${mediaAttachment.name} received ${siaLink} SIA link`);
                mediaAttachment.siaLink = siaLink;
                await this.mediaAttachmentRepository.save(mediaAttachment);
            })
            .catch(error => {
                this.log.error(`Error occurred when tried to upload media attachment ${mediaAttachment.name} to SIA`);
                console.log(error);
            })
    }

    /**
     * Remove this after the first run
     */
    public async generatePreviewsForExistingMediaAttachments(): Promise<void> {
        // don't try to understand this ;)
        const attachmentsNeedingPreviews = await this.mediaAttachmentRepository
            .createQueryBuilder("media_attachment_alias")
            .leftJoin(
                "media_attachment",
                "media_attachment",
                `(
                    media_attachment.\"preview128Id\" = media_attachment_alias.id OR 
                    media_attachment.\"preview256Id\" = media_attachment_alias.id OR 
                    media_attachment.\"preview512Id\" = media_attachment_alias.id OR 
                    media_attachment.\"preview1024Id\" = media_attachment_alias.id 
                )`
            )
            .where("(media_attachment_alias.width > 128 OR media_attachment_alias.height > 128 )")
            .andWhere("media_attachment_alias.\"preview128Id\" IS NULL")
            .andWhere("media_attachment.id IS NULL")
            .getMany()

        this.log.info(`Found ${attachmentsNeedingPreviews.length} media attachments without previews`)

        for (const attachmentNeedingPreviews of attachmentsNeedingPreviews) {
            const imagePath = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, `${attachmentNeedingPreviews.id}.${attachmentNeedingPreviews.format}`);
            const fileTypeResult = await FileTypeExtractor.fromFile(imagePath)
            const imageSize = await this.getImageSize(imagePath)
            const previews = await this.generateMediaAttachmentPreviews(imagePath, fileTypeResult, imageSize)
            this.mediaAttachmentRepository.merge(attachmentNeedingPreviews, previews)
            await this.mediaAttachmentRepository.save(attachmentNeedingPreviews)
        }
 
        this.log.info(`Created previews for ${attachmentsNeedingPreviews.length} media attachments without previews`)
    }
}
