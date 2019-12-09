import {Env} from "env-decorator";

export class EnvConfig {
    @Env({required: true, type: "string"})
    SERVICE_NODE_API_URL: string;

    @Env({required: true, type: "number"})
    PORT: number;

    @Env({required: true, type: "string"})
    LOGGING_LEVEL: string;

    @Env({required: true, type: "string"})
    STORAGE_DIRECTORY: string;

    @Env({required: true, type: "string"})
    SERVICE_NODE_ACCOUNT_ADDRESS: string;

    @Env({required: true, type: "string"})
    ENCRYPTOR_SERVICE_URL: string;
}
