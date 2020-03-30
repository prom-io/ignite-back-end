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

    @Env({required: true, type: "string"})
    JWT_SECRET: string;

    @Env({type: "string"})
    DATABASE_NAME: string = "data_validator";

    @Env({type: "string"})
    DATABASE_HOST: string = "localhost";

    @Env({type: "number"})
    DATABASE_PORT: number = 5432;

    @Env({type: "string"})
    DATABASE_USERNAME: string = "postgres";

    @Env({type: "string"})
    DATABASE_PASSWORD: string | undefined = undefined;

    @Env({type: "boolean"})
    RECREATE_DATABASE_SCHEMA: boolean = false;

    @Env({type: "string", required: true})
    MICROBLOGGING_BLOCKCHAIN_API_URL: string;

    @Env({type: "string", required: true})
    HOST: string;

    @Env({type: "string", required: true})
    MEDIA_ATTACHMENTS_DIRECTORY: string;

    @Env({type: "string", required: true})
    DEFAULT_AVATAR_URL: string;

    @Env({type: "string"})
    LIBP2P_NODE_PORT: number = 12578;
}
