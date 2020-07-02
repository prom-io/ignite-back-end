import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import {Response} from "express";
import fileSystem from "fs";
import path from "path";
import graphicsMagic from "gm";
import FileTypeExtractor from "file-type";
import uuid from "uuid/v4";
import {MediaAttachmentsRepository} from "./MediaAttachmentsRepository";
import {MediaAttachmentResponse, MultipartFile} from "./types";
import {MediaAttachment} from "./entities";
import {MediaAttachmentsMapper} from "./MediaAttachmentsMapper";
import {config} from "../config";
import {SkynetClient} from "../skynet";

const gm = graphicsMagic.subClass({imageMagick: true});

@Injectable()
export class MediaAttachmentsService {
    constructor(private readonly mediaAttachmentRepository: MediaAttachmentsRepository,
                private readonly mediaAttachmentsMapper: MediaAttachmentsMapper,
                private readonly skynetClient: SkynetClient,
                private readonly log: LoggerService) {
    }

    public saveMediaAttachment(multipartFile: MultipartFile): Promise<MediaAttachmentResponse> {
        return new Promise<MediaAttachmentResponse>(async (resolve, reject) => {
            try {
                const id = uuid();
                const temporaryFilePath = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, `${id}.temporary`);
                const fileDescriptor = fileSystem.openSync(temporaryFilePath, "w");
                fileSystem.writeSync(fileDescriptor, multipartFile.buffer);
                fileSystem.closeSync(fileDescriptor);

                const file = await FileTypeExtractor.fromBuffer(fileSystem.readFileSync(temporaryFilePath));
                if (file.mime.startsWith("image")) {
                    gm(temporaryFilePath)
                        .size(async (error, size) => {
                            if (error) {
                                console.log(error);
                                reject(error);
                            }

                            const permanentFilePath = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, `${id}.${file.ext}`);
                            fileSystem.renameSync(temporaryFilePath, permanentFilePath);

                            const mediaAttachment: MediaAttachment = {
                                id,
                                format: file.ext,
                                mimeType: file.mime,
                                height: size.height,
                                width: size.width,
                                name: `${id}.${file.ext}`,
                                siaLink: null
                            };
                            await this.mediaAttachmentRepository.save(mediaAttachment);

                            if (config.ENABLE_UPLOADING_IMAGES_TO_SIA) {
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

                            resolve(this.mediaAttachmentsMapper.toMediaAttachmentResponse(mediaAttachment));
                        })
                }
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    }

    public async getMediaAttachmentByName(name: string, response: Response): Promise<void> {
        const mediaAttachment = await this.mediaAttachmentRepository.findByName(name);

        if (!mediaAttachment) {
            throw new HttpException(`Could not find ${name}`, HttpStatus.NOT_FOUND);
        }

        const fileExists = fileSystem.existsSync(path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, name));

        if (fileExists) {
            response.header("Content-Type", mediaAttachment.mimeType);
            fileSystem.createReadStream(path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, name)).pipe(response);
        } else {
            await this.skynetClient.downloadFile(path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, name), mediaAttachment.siaLink);
            response.header("Content-Type", mediaAttachment.mimeType);
            fileSystem.createReadStream(path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, name)).pipe(response);
        }
    }
}
