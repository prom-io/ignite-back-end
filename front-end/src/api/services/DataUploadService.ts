import {AxiosPromise} from "axios";
import {axiosInstance} from "../api-client";
import {CHUNK, FILES, LOCAL, SERVICE_NODE, STATUS, TO_SERVICE_NODE} from "../endpoints";
import {
    CreateLocalFileRecordRequest,
    DdsFileUploadCheckResponse,
    ExtendFileStorageDurationRequest,
    LocalFileRecordResponse,
    UploadFileChunkRequest
} from "../../models";

export class DataUploadService {

    public static createLocalFile(): AxiosPromise<{id: string}> {
        return axiosInstance.post(`/${FILES}/${LOCAL}`);
    }

    public static sendFileChunk(localFileId: string, uploadChunkRequest: UploadFileChunkRequest): AxiosPromise<{success: boolean}> {
        return axiosInstance.post(`/${FILES}/${LOCAL}/${localFileId}/${CHUNK}`, uploadChunkRequest);
    }

    public static uploadLocalFileToServiceNode(localFileId: string, createLocalFileRecordRequest: CreateLocalFileRecordRequest): AxiosPromise<LocalFileRecordResponse> {
        return axiosInstance.post(`/${FILES}/${LOCAL}/${localFileId}/${TO_SERVICE_NODE}`, createLocalFileRecordRequest);
    }

    public static checkIfLocalFileUploadToDds(localFileId: string): AxiosPromise<DdsFileUploadCheckResponse> {
        return axiosInstance.get(`/${FILES}/${SERVICE_NODE}/${localFileId}/${STATUS}`);
    }

    public static deleteLocalFile(localFileId: string): AxiosPromise<void> {
        return axiosInstance.delete(`/${FILES}/${SERVICE_NODE}/${localFileId}`);
    }

    public static extendFileStorageDuration(fileId: string, extendFileStorageDurationRequest: ExtendFileStorageDurationRequest): AxiosPromise<{success: boolean}> {
        return axiosInstance.patch(`/${FILES}/${fileId}`, extendFileStorageDurationRequest);
    }
}
