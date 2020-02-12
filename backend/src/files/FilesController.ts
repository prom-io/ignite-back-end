import {Controller, Body, Param, Post, Get, Delete, Patch, Query} from "@nestjs/common";
import {FilesService} from "./FilesService";
import {CreateServiceNodeFileRequest, ExtendFileStorageDurationRequest, PurchaseFileRequestSignature, UploadChunkRequest} from "./types/request";
import {CheckFileUploadStatusResponse, FileResponse, ServiceNodeFileResponse} from "./types/response";
import {decodeUrlEncodedObjectProperties} from "../utils/decode-url";

@Controller("api/v3/files")
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post("local")
    public createServiceNodeFile(): Promise<{id: string}> {
        return this.filesService.createLocalFile();
    }

    @Post("local/:localFileId/chunk")
    public uploadLocalFileChink(
        @Param("localFileId") localFileId: string,
        @Body() uploadChunkRequest: UploadChunkRequest
    ): Promise<void> {
        return this.filesService.uploadLocalFileChunk(localFileId, uploadChunkRequest);
    }

    @Get(":fileId")
    public findFileById(@Param("fileId") fileId: string): Promise<FileResponse> {
        return this.filesService.findFileById(fileId);
    }

    @Post("local/:localFileId/to-service-node")
    public uploadLocalFileToServiceNode(
        @Param("localFileId") localFileId: string,
        @Body() createServiceNodeFileRequest: CreateServiceNodeFileRequest
    ): Promise<ServiceNodeFileResponse> {
        return this.filesService.uploadLocalFileToServiceNode(localFileId, createServiceNodeFileRequest);
    }

    @Get("service-node/:serviceNodeFileId/status")
    public checkFileUploadStatus(@Param("serviceNodeFileId") serviceNodeFileId: string): Promise<CheckFileUploadStatusResponse> {
        return this.filesService.checkServiceFileUploadStatusAndSaveFileIfItHasBeenUploaded(serviceNodeFileId);
    }

    @Delete("service-node/:serviceNodeFileId")
    public deleteServiceNodeFile(@Param("serviceNodeFileId") serviceNodeFileId: string): Promise<{success: boolean}> {
        return this.filesService.deleteServiceNodeFile(serviceNodeFileId);
    }

    @Patch(":fileId")
    public extendFileStorageDuration(@Param("fileId") fileId: string,
                                     @Body() extendFileStorageDurationRequest: ExtendFileStorageDurationRequest): Promise<{success: boolean}> {
        return this.filesService.extendFileStorageDuration(fileId, extendFileStorageDurationRequest);
    }

    @Get(":fileId/key")
    public getFileKey(@Param("fileId") fileId: string,
                      @Query() purchaseFileRequestSignature: PurchaseFileRequestSignature): Promise<{key: string, iv: string}> {
        return this.filesService.getFileKey(fileId, decodeUrlEncodedObjectProperties(purchaseFileRequestSignature));
    }
}
