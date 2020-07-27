import {HttpException, HttpStatus, Injectable, BadRequestException} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import {Response} from "express";
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
import {promisify} from "util"

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
            siaLink: null
        };
        await this.mediaAttachmentRepository.save(mediaAttachment);

        if (config.ENABLE_UPLOADING_IMAGES_TO_SIA) {
            // do not await, cuz the execution can take several seconds
            this.skynetClient.uploadFile(permanentFilePath)
                .then(async siaLink => {
                    this.log.info(`Media attachment ${mediaAttachment.name} has been uploaded to SIA`);
                    this.log.debug(`Media attachment ${mediaAttachment.name} received ${siaLink} SIA link`);
                    mediaAttachment.siaLink = siaLink;
                    await this.mediaAttachmentRepository.save(mediaAttachment);
                })
                .catch(error => {
                    this.log.error(`Error occurred when tried to upload media attachment ${mediaAttachment.name} to SIA`);
                    console.log(error);
                });
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

    private async getImageSize(imagePath: string): Promise<Dimensions> {
        const gmState = gm(imagePath)

        return promisify(gmState.size.bind(gmState))()
    }
}
