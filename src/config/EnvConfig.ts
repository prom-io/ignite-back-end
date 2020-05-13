import {Env} from "env-decorator";

export class EnvConfig {
    @Env({required: true, type: "number"})
    IGNITE_API_PORT: number;

    @Env({required: true, type: "string"})
    LOGGING_LEVEL: string;

    @Env({required: true, type: "string"})
    INITIAL_ACCOUNT_PRIVATE_KEY: string;

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
    BTFS_API_BASE_URL: string;

    @Env({type: "boolean", required: false})
    ENABLE_BTFS_PULLING: boolean = false;

    @Env({type: "boolean", required: false})
    ENABLE_BTFS_PUSHING: boolean = false;

    @Env({type: "string", required: true})
    APACHE_KAFKA_HOST: string;

    @Env({type: "number", required: true})
    APACHE_KAFKA_PORT: number;

    @Env({type: "string", required: true})
    EMAIL_USERNAME: string;

    @Env({type: "string", required: true})
    EMAIL_PASSWORD: string;

    @Env({type: "string", required: true})
    EMAIL_SMTP_SERVER_HOST: string;

    @Env({type: "number", required: true})
    EMAIL_SMTP_SERVER_PORT: number;

    @Env({type: "string", required: true})
    EMAIL_ADDRESS_TO_SEND: string;

    @Env({type: "string", required: true})
    API_HOST: string;
}
