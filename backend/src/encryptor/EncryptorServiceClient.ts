import {Inject, Injectable} from "@nestjs/common";
import {AxiosInstance, AxiosPromise} from "axios";
import {EncryptorServiceResponse, GenerateRsaKeyPairResponse, RsaEncryptResponse} from "./types/response";
import {EncryptorServiceMethod, EncryptorServiceRequest, RsaDecryptRequest, RsaEncryptRequest} from "./types/request";

// @Injectable()
export class EncryptorServiceClient {
    constructor(/*@Inject("encryptorServiceAxios")*/ private readonly axios: AxiosInstance) {}

    public generateRsaKeyPair(): AxiosPromise<EncryptorServiceResponse<GenerateRsaKeyPairResponse>> {
        const request: EncryptorServiceRequest<{}> = {
            id: "1",
            jsonrpc: "2.0",
            method: EncryptorServiceMethod.KEY_GENERATE,
            params: {}
        };

        return this.axios.post("/", request);
    }

    public encryptWithRsaPublicKey(rsaEncryptRequest: RsaEncryptRequest): AxiosPromise<EncryptorServiceResponse<RsaEncryptResponse>> {
        const request: EncryptorServiceRequest<RsaEncryptRequest> = {
            id: "1",
            jsonrpc: "2.0",
            method: EncryptorServiceMethod.RSA_PUBLIC_KEY_ENCRYPT,
            params: rsaEncryptRequest
        };

        return this.axios.post("/", request);
     }

     public decryptWithRsaPrivateKey(rsaDecryptRequest: RsaDecryptRequest): AxiosPromise<EncryptorServiceResponse<RsaDecryptRequest>> {
        const request: EncryptorServiceRequest<RsaDecryptRequest> = {
            id: "1",
            jsonrpc: "2.0",
            method: EncryptorServiceMethod.RSA_PRIVATE_KEY_DECRYPT,
            params: rsaDecryptRequest
        };

        return this.axios.post("/", request);
     }
}
