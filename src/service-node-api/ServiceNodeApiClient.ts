import {Injectable, Inject} from "@nestjs/common";
import {AxiosInstance, AxiosPromise} from "axios";
import {
    BalanceResponse,
    CheckFileUploadStatusResponse,
    DataOwnersOfDataValidatorResponse,
    DdsFileResponse,
    ServiceNodeFileResponse
} from "../model/api/response";
import {
    IUploadChunkRequest,
    ICreateServiceNodeFileRequest,
    ICreateAccountRequest,
    ICreateDataOwnerRequest
} from "../model/api/request";

@Injectable()
export class ServiceNodeApiClient {
    constructor(@Inject("serviceNodeApiAxios") private readonly axios: AxiosInstance) {};

    public createServiceNodeFile(createServiceNodeFileRequest: ICreateServiceNodeFileRequest): AxiosPromise<ServiceNodeFileResponse> {
        return this.axios.post("/api/v1/files/local", createServiceNodeFileRequest);
    }

    public uploadFileChunk(serviceNodeFileId: string, uploadFileChunkRequest: IUploadChunkRequest): AxiosPromise<{success: boolean}> {
        return this.axios.post(`/api/v1/files/local/${serviceNodeFileId}/chunk`, uploadFileChunkRequest);
    }

    public uploadFileToDds(serviceNodeFileId: string): AxiosPromise<{success: boolean}> {
        return this.axios.post(`/api/v1/files/local/${serviceNodeFileId}/to-dds`);
    }

    public checkFileUploadStatus(serviceNodeFileId: string): AxiosPromise<CheckFileUploadStatusResponse> {
        return this.axios.get(`/api/v1/files/local/${serviceNodeFileId}/is-fully-uploaded`);
    }

    public deleteServiceNodeFile(serviceNodeFileId: string): AxiosPromise<{success: boolean}> {
        return this.axios.delete(`/api/v1/files/local/${serviceNodeFileId}`);
    }

    public getDataOwnersOfDataValidator(dataValidatorAddress: string): AxiosPromise<DataOwnersOfDataValidatorResponse> {
        return this.axios.get(`/api/v1/data-validators/${dataValidatorAddress}/data-owners`);
    }

    public getFileInfo(fileId: string): AxiosPromise<DdsFileResponse> {
        return this.axios.get(`/api/v1/files/${fileId}/info`);
    }

    public getBalanceOfAccount(address: string): AxiosPromise<BalanceResponse> {
        return this.axios.get(`/api/v1/accounts/${address}/balance`);
    }

    public registerAccount(createAccountRequest: ICreateAccountRequest): AxiosPromise<void> {
        return this.axios.post("/api/v1/accounts", createAccountRequest);
    }

    public registerDataOwner(createDataOwnerRequest: ICreateDataOwnerRequest): AxiosPromise<DataOwnersOfDataValidatorResponse> {
        return this.axios.post("/api/v1/accounts/data-owners", createDataOwnerRequest);
    }
}
