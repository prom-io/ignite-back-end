import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {AxiosError} from "axios";
import {FilesRepository} from "./FilesRepository";
import {ServiceNodeApiClient} from "../service-node-api";
import {ExtendFileStorageDurationRequest, ICreateServiceNodeFileRequest, IUploadChunkRequest} from "../model/api/request";
import {CheckFileUploadStatusResponse, ServiceNodeFileResponse} from "../model/api/response";
import {EntityType} from "../model/entity";
import {DataOwnersRepository} from "../accounts";
import {config} from "../config";

@Injectable()
export class FilesService {
    constructor(private readonly filesRepository: FilesRepository,
                private readonly dataOwnersRepository: DataOwnersRepository,
                private readonly serviceNodeClient: ServiceNodeApiClient) {}

    public async createServiceNodeFile(createServiceNodeFileRequest: ICreateServiceNodeFileRequest): Promise<ServiceNodeFileResponse> {
        try {
            return (await this.serviceNodeClient.createServiceNodeFile({
                ...createServiceNodeFileRequest,
                serviceNodeAddress: config.SERVICE_NODE_ACCOUNT_ADDRESS
            })).data;
        } catch (error) {
            this.handleServiceNodeError(error);
        }
    }

    public async uploadFileChunk(serviceNodeFileId: string, uploadChunkRequest: IUploadChunkRequest): Promise<{success: boolean}> {
        try {
            return (await this.serviceNodeClient.uploadFileChunk(serviceNodeFileId, uploadChunkRequest)).data;
        } catch (error) {
            this.handleServiceNodeError(error);
        }
    }

    public async checkServiceFileUploadStatusAndSaveFileIfItHasBeenUploaded(serviceNodeFileId: string): Promise<CheckFileUploadStatusResponse> {
        try {
            const uploadStatus = (await this.serviceNodeClient.checkFileUploadStatus(serviceNodeFileId)).data;

            if (uploadStatus.fullyUploaded) {
                this.serviceNodeClient.getFileInfo(uploadStatus.ddsFileId)
                    .then(({data}) => this.filesRepository.save({
                        id: data.id,
                        _type: EntityType.FILE,
                        mimeType: data.mimeType,
                        extension: data.extension,
                        name: data.name,
                        dataValidator: data.dataValidator,
                        dataOwner: data.dataOwner,
                        keepUntil: data.keepUntil,
                        metadata: data.metadata,
                        serviceNode: data.serviceNode,
                        size: Number(data.size),
                        createdAt: new Date().toISOString(),
                        price: data.price
                    }))
                    .then(file => {
                        this.dataOwnersRepository.save({
                            file,
                            _type: EntityType.DATA_OWNER,
                            dataValidatorAddress: file.dataValidator,
                            privateKey: uploadStatus.privateKey!,
                            address: uploadStatus.dataOwner
                        });
                    })
            }

            return uploadStatus;
        } catch (error) {
            this.handleServiceNodeError(error);
        }
    }

    public async uploadFileToDds(serviceNodeFileId: string): Promise<{success: boolean}> {
        try {
            return (await this.serviceNodeClient.uploadFileToDds(serviceNodeFileId)).data;
        } catch (error) {
            this.handleServiceNodeError(error);
        }
    }

    public async deleteServiceNodeFile(serviceNodeFileId: string): Promise<{success: boolean}> {
        try {
            return (await this.serviceNodeClient.deleteServiceNodeFile(serviceNodeFileId)).data;
        } catch (error) {
            this.handleServiceNodeError(error);
        }
    }

    public async extendFileStorageDuration(
        fileId: string,
        extendFileStorageDurationRequest: ExtendFileStorageDurationRequest
    ): Promise<{success: boolean}> {
        try {
            const file = await this.filesRepository.findById(fileId);
            await this.serviceNodeClient.extendFileStorageDuration(fileId, extendFileStorageDurationRequest);

            if (file) {
                file.keepUntil = extendFileStorageDurationRequest.keepUntil;
                const dataOwner = await this.dataOwnersRepository.findByFileId(fileId);
                dataOwner.file = file;
                await this.filesRepository.save(file);
                await this.dataOwnersRepository.save(dataOwner);
            }

            return {success: true}
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    throw new HttpException(`Could not find file with id ${fileId}`, HttpStatus.NOT_FOUND);
                } else {
                    throw new HttpException(
                        `Could not extend file storage duration, service node responded with ${error.response.status} status`,
                        HttpStatus.INTERNAL_SERVER_ERROR
                    )
                }
            } else {
                throw new HttpException(
                    "Service node is unreachable",
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            }
        }
    }

    private handleServiceNodeError(error: any): void {
        if (error.response) {
            error = error as AxiosError;
            // tslint:disable-next-line:max-line-length
            throw new HttpException(
                `Could not create Service node file. Service node responded with ${error.response.status} status`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        } else {
            throw new HttpException("Service node is unreachable", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
