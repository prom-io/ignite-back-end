import {Env} from "env-decorator";

export class EnvConfig {
    @Env({required: true, type: "number"})
    DATA_VALIDATOR_API_PORT: number;

    @Env({required: true, type: "string"})
    LOGGING_LEVEL: string;

    @Env({required: true, type: "string"})
    NEDB_DIRECTORY: string;

    @Env({required: true, type: "string"})
    ENCRYPTOR_SERVICE_URL: string;

    @Env({required: true, type: "string"})
    INITIAL_ACCOUNT_PRIVATE_KEY: string;

    @Env({required: true, type: "string"})
    USE_LOCAL_IP_FOR_REGISTRATION: boolean = false;

    @Env({type: "string"})
    LOCAL_FILES_DIRECTORY: string = "storage/files";
}
