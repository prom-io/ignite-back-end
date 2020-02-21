import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {Response} from "express";
import fileSystem from "fs";
import path from "path";
import gm from "gm";
import FileTypeExtractor from "file-type";
import {MediaAttachmentsRepository} from "./MediaAttachmentsRepository";
import {MediaAttachmentResponse, MultipartFile} from "./types";
import {config} from "../config";
import uuid from "uuid/v4";
import {MediaAttachment} from "./entities";
import {MediaAttachmentsMapper} from "./MediaAttachmentsMapper";

@Injectable()
export class MediaAttachmentsService {
    constructor(private readonly mediaAttachmentRepository: MediaAttachmentsRepository,
                private readonly mediaAttachmentsMapper: MediaAttachmentsMapper) {
    }
    
    public saveMediaAttachment(multipartFile: MultipartFile): Promise<MediaAttachmentResponse> {

        return new Promise<MediaAttachmentResponse>(async resolve => {
            const id = uuid();
            const temporaryFilePath = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, `${id}.temporary`);
            const fileDescriptor = fileSystem.openSync(temporaryFilePath, "w");
            fileSystem.writeSync(fileDescriptor, multipartFile.buffer);
            fileSystem.closeSync(fileDescriptor);

            FileTypeExtractor.fromBuffer(fileSystem.readFileSync(temporaryFilePath)).then(result => {
                if (result.mime.startsWith("image")) {
                    gm(temporaryFilePath)
                        .size(async (error, size) => {
                            console.log(error);
                            const mediaAttachment: MediaAttachment = {
                                id,
                                format: result.ext,
                                mimeType: result.mime,
                                height: size.height,
                                width: size.width,
                                name: `${id}.${result.ext}`
                            };
                            await this.mediaAttachmentRepository.save(mediaAttachment);

                            const permanentFilePath = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, `${id}.${result.ext}`);
                            fileSystem.renameSync(temporaryFilePath, permanentFilePath);
                            resolve(this.mediaAttachmentsMapper.toMediaAttachmentResponse(mediaAttachment));
                        })
                }
            })
        })
    }

    public async getMediaAttachmentByName(name: string, response: Response): Promise<void> {
        const mediaAttachment = await this.mediaAttachmentRepository.findByName(name);

        if (!mediaAttachment) {
            throw new HttpException(`Could not find ${name}`, HttpStatus.NOT_FOUND);
        }

        const fileExists = fileSystem.existsSync(path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, name));

        if (!fileExists) {
            throw new HttpException(`Could not find ${name}`, HttpStatus.NOT_FOUND);
        }

        response.header("Content-Type", mediaAttachment.mimeType);
        fileSystem.createReadStream(path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, name)).pipe(response);
    }
}
