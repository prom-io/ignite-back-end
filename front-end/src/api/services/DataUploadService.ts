import {AxiosPromise} from "axios";
import {axiosInstance} from "../api-client";
import {
    CreateLocalFileRecordRequest,
    DdsFileUploadCheckResponse,
    LocalFileRecordResponse,
    UploadFileChunkRequest
} from "../../models";
import {CHUNK, FILES, SERVICE_NODE, STATUS, TO_DDS} from "../endpoints";

export class DataUploadService {
    public static createLocalFileRecord(creatLocalFileRecordRequest: CreateLocalFileRecordRequest): AxiosPromise<LocalFileRecordResponse> {
        return axiosInstance.post(`/${FILES}/${SERVICE_NODE}`, creatLocalFileRecordRequest);
    }

    public static sendFileChunk(localFileId: string, uploadChunkRequest: UploadFileChunkRequest): AxiosPromise<{success: boolean}> {
        return axiosInstance.post(`/${FILES}/${SERVICE_NODE}/${localFileId}/${CHUNK}`, uploadChunkRequest);
    }

    public static uploadLocalFileToDds(localFileId: string): AxiosPromise<{success: boolean}> {
        return axiosInstance.post(`/${FILES}/${SERVICE_NODE}/${localFileId}/${TO_DDS}`);
    }

    public static checkIfLocalFileUploadToDds(localFileId: string): AxiosPromise<DdsFileUploadCheckResponse> {
        return axiosInstance.get(`/${FILES}/${SERVICE_NODE}/${localFileId}/${STATUS}`);
    }

    public static deleteLocalFile(localFileId: string): AxiosPromise<void> {
        return axiosInstance.delete(`/${FILES}/${SERVICE_NODE}/${localFileId}`);
    }
}
