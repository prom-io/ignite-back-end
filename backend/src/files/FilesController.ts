import {Controller, Body, Param, Post, Get, Delete, Patch} from "@nestjs/common";
import {FilesService} from "./FilesService";
import {CreateServiceNodeFileRequest, ExtendFileStorageDurationRequest, UploadChunkRequest} from "./types/request";
import {CheckFileUploadStatusResponse, ServiceNodeFileResponse} from "./types/response";

@Controller("api/v3/files")
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post("service-node")
    public createServiceNodeFile(@Body() createServiceNodeFileRequest: CreateServiceNodeFileRequest): Promise<ServiceNodeFileResponse> {
        return this.filesService.createServiceNodeFile(createServiceNodeFileRequest);
    }

    @Post("service-node/:serviceNodeFileId/to-dds")
    public uploadServiceNodeFileToDds(@Param("serviceNodeFileId") serviceNodeFileId: string): Promise<{success: boolean}> {
        return this.filesService.uploadFileToDds(serviceNodeFileId);
    }

    @Post("service-node/:serviceNodeFileId/chunk")
    public uploadFileChunk(@Param("serviceNodeFileId") serviceNodeFileId: string,
                           @Body() uploadChunkRequest: UploadChunkRequest): Promise<{success: boolean}> {
        return this.filesService.uploadFileChunk(serviceNodeFileId, uploadChunkRequest);
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
}
