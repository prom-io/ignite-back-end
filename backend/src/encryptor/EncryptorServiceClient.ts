import {Injectable, Inject} from "@nestjs/common";
import {AxiosInstance, AxiosPromise} from "axios";
import {AesDecryptResponse, AesEncryptResponse, EncryptorServiceResponse, GenerateRsaKeyPairResponse, RsaEncryptResponse} from "./types/response";
import {
    AesDecryptRequest,
    AesEncryptRequest,
    EncryptorServiceMethod,
    EncryptorServiceRequest,
    RsaDecryptRequest,
    RsaEncryptRequest
} from "./types/request";

@Injectable()
export class EncryptorServiceClient {
    constructor(@Inject("encryptorServiceAxios") private readonly axios: AxiosInstance) {}

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

     public encryptWithAes(aesEncryptRequest: AesEncryptRequest): AxiosPromise<EncryptorServiceResponse<AesEncryptResponse>> {
        const request: EncryptorServiceRequest<AesEncryptRequest> = {
            id: "1",
            jsonrpc: "2.0",
            method: EncryptorServiceMethod.AES_ENCRYPT,
            params: aesEncryptRequest
        };

        return this.axios.post("/", request);
     }

     public decryptWithAes(aesDecryptRequest: AesDecryptRequest): AxiosPromise<EncryptorServiceResponse<AesDecryptResponse>> {
        const request: EncryptorServiceRequest<AesEncryptRequest> = {
            id: "1",
            jsonrpc: "2.0",
            method: EncryptorServiceMethod.AES_DECRYPT,
            params: aesDecryptRequest
        };

        return this.axios.post("/", request);
     }
}
