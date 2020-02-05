import {EncryptorServiceMethod} from "./EncryptorServiceMethod";

export interface EncryptorServiceRequest<Body> {
    id: string,
    method: EncryptorServiceMethod,
    jsonrpc: string,
    params: Body
}
