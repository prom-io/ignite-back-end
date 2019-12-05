import Axios, {AxiosPromise} from "axios";
import {GenerateRsaKeyPairResponse, EncryptFileRequest, EncryptFileResponse} from "../../models";
import {EncryptorServiceResponse} from "../../models/EncryptorServiceResponse";

export class EncryptorService {
    private static readonly ENCRYPTOR_SERVICE_URL = `${process.env.REACT_APP_ENCRYPTOR_SERVICE_URL || "http://localhost:3030"}`;

    public static generateRsaKeyPair(): AxiosPromise<EncryptorServiceResponse<GenerateRsaKeyPairResponse>> {
        return Axios.post(`${EncryptorService.ENCRYPTOR_SERVICE_URL}`, {
            method: 'key_generate',
            params: {},
            jsonrpc: "2.0",
            id: 1234
        });
    }

    public static encryptFile(encryptFileRequest: EncryptFileRequest): AxiosPromise<EncryptorServiceResponse<EncryptFileResponse>> {
        return Axios.post(`${EncryptorService.ENCRYPTOR_SERVICE_URL}`, {
            method: 'rsa_public_key_encrypt',
            params: {
                ...encryptFileRequest
            },
            jsonprc: "2.0",
            id: 1234
        });
    }
}
