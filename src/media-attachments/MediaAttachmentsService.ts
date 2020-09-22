import {HttpException, HttpStatus, Injectable, BadRequestException, Logger} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import {Response} from "express";
import {promisify} from "util"
import fileSystem from "fs";
import path from "path";
import graphicsMagic, { Dimensions } from "gm";
import FileTypeExtractor from "file-type";
import uuid from "uuid/v4";
import {MediaAttachmentsRepository} from "./MediaAttachmentsRepository";
import {MediaAttachmentResponse, MultipartFile, MediaAttachmentOptions} from "./types";
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

        const mediaAttachment = new MediaAttachment({
            id,
            format: fileTypeResult.ext,
            mimeType: fileTypeResult.mime,
            height: size.height,
            width: size.width,
            name: `${id}.${fileTypeResult.ext}`,
            siaLink: null,
        });

        await this.mediaAttachmentRepository.save(mediaAttachment);

        if (config.ENABLE_UPLOADING_IMAGES_TO_SIA) {
            // do not await, cuz the execution can take several seconds
            this.uploadMediaAttachmentToSkynet(mediaAttachment)
        }

        return this.mediaAttachmentsMapper.toMediaAttachmentResponse(mediaAttachment);
    }

    public async getMediaAttachmentByName(name: string, response: Response, options?: MediaAttachmentOptions): Promise<void> {
        let mediaAttachment = await this.mediaAttachmentRepository.findByName(name)
        if (!mediaAttachment) {
            throw new HttpException(`Could not find ${name}`, HttpStatus.NOT_FOUND)
        }

        // if the preview is requested, then find or create it if it does not exist in required size
        if (options && options.size && mediaAttachment.format !== "gif") {

            let previewInRequiredSize =
            await this.mediaAttachmentRepository.findPreviewByOriginalIdAndSize(mediaAttachment.id, options.size)
            
            if (!previewInRequiredSize) {
                previewInRequiredSize = await this.createPreview(mediaAttachment, options.size)
            }
            
            mediaAttachment = previewInRequiredSize
            
        }

        const filePath = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, mediaAttachment.name)

        if (!await exists(filePath)) {
            await this.skynetClient.downloadFile(filePath, mediaAttachment.siaLink);
        }

        response.header("Cache-Control", "public, max-age=604800, immutable")
        response.header("Content-Type", mediaAttachment.mimeType);
        fileSystem.createReadStream(filePath).pipe(response);
    }

    private async createPreview(originalMediaAttachment: MediaAttachment, previewSize: number): Promise<MediaAttachment> {
        if (previewSize >= originalMediaAttachment.height && previewSize >= originalMediaAttachment.width) {
            return originalMediaAttachment
        }

        const originalFilePath = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, originalMediaAttachment.name)

        if (!await exists(originalFilePath)) {
            await this.skynetClient.downloadFile(originalFilePath, originalMediaAttachment.siaLink);
        }

        const fileTypeResult = await FileTypeExtractor.fromFile(originalFilePath)

        const id = uuid()
        const previewPath = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, `${id}.${fileTypeResult.ext}`)

        const gmInstance = gm(originalFilePath).resize(previewSize, previewSize)
        await promisify(gmInstance.write.bind(gmInstance))(previewPath)

        const generatedPreviewImageSize = await this.getImageSize(previewPath)

        const mediaAttachment = new  MediaAttachment({
            id,
            format: fileTypeResult.ext,
            mimeType: fileTypeResult.mime,
            height: generatedPreviewImageSize.height,
            width: generatedPreviewImageSize.width,
            name: `${id}.${fileTypeResult.ext}`,
            original: originalMediaAttachment,
            previewSize,
            siaLink: null
        })

        if (config.ENABLE_UPLOADING_IMAGES_TO_SIA) {
            // do not await, cuz the execution can take several seconds
            this.uploadMediaAttachmentToSkynet(mediaAttachment)
        }

        await this.mediaAttachmentRepository.save(mediaAttachment)

        return mediaAttachment
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
                // tslint:disable-next-line no-console
                console.log(error);
            })
    }
}
