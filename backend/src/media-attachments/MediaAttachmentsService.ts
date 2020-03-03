import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {Response} from "express";
import fileSystem from "fs";
import path from "path";
import gm from "gm";
import FileTypeExtractor from "file-type";
import uuid from "uuid/v4";
import {MediaAttachmentsRepository} from "./MediaAttachmentsRepository";
import {MediaAttachmentResponse, MultipartFile} from "./types";
import {MediaAttachment} from "./entities";
import {MediaAttachmentsMapper} from "./MediaAttachmentsMapper";
import {config} from "../config";
import {SkynetClient} from "../skynet";

@Injectable()
export class MediaAttachmentsService {
    constructor(private readonly mediaAttachmentRepository: MediaAttachmentsRepository,
                private readonly mediaAttachmentsMapper: MediaAttachmentsMapper,
                private readonly skynetClient: SkynetClient) {
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
                            const siaLink = await this.skynetClient.uploadFile(permanentFilePath);
                            const mediaAttachment: MediaAttachment = {
                                id,
                                format: file.ext,
                                mimeType: file.mime,
                                height: size.height,
                                width: size.width,
                                name: `${id}.${file.ext}`,
                                siaLink
                            };
                            await this.mediaAttachmentRepository.save(mediaAttachment);
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
