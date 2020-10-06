import {Env} from "env-decorator";
import optionalRequire from "optional-require";
import {AdditionalJsonConfig} from "./types/AdditionalJsonConfig";

const additionalJsonConfig = optionalRequire(require)("../../additional-config.json") || {} as AdditionalJsonConfig;

export class EnvConfig {

    @Env({type: "string"})
    NODE_ENV: string;

    @Env({type: "string"})
    GOOGLE_RECAPTCHA_SECRET_KEY: string

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
    AUTO_RUN_DB_MIGRATIONS: boolean = false;

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

    @Env({type: "boolean", required: false})
    ENABLE_FIREBASE_PUSH_NOTIFICATIONS: boolean = false;

    @Env({type: "boolean", required: false})
    ENABLE_GLOBAL_TIMELINE_FILTERING: boolean = false;

    @Env({type: "string", required: false})
    KOREAN_FILTERING_USER_ADDRESS: string | undefined;

    @Env({type: "string", required: false})
    ENGLISH_FILTERING_USER_ADDRESS: string | undefined;

    @Env({type: "string", required: true})
    PROMETEUS_WALLET_GENERATOR_API_BASE_URL: string;

    @Env({type: "string", required: true})
    PROMETEUS_WALLET_GENERATOR_API_USERNAME: string;

    @Env({type: "string", required: true})
    PROMETEUS_WALLET_GENERATOR_API_PASSWORD: string;

    @Env({type: "string", required: true})
    IGNITE_PASSWORD_HASH_API_BASE_URL: string;

    @Env({type: "string", required: true})
    IGNITE_TOKEN_EXCHANGE_API_BASE_URL: string;

    @Env({type: "boolean", required: false})
    ENABLE_UPLOADING_IMAGES_TO_SIA: boolean = true;

    @Env({type: "boolean", required: false})
    ENABLE_ACCOUNTS_SUBSCRIPTION_UPON_SIGN_UP: boolean = false;

    @Env({type: "boolean", required: false})
    ENABLE_PINNED_STATUSES_FOR_UNAUTHORIZED_USERS: boolean = false;

    @Env({type: "string", required: false})
    ENGLISH_PINNED_STATUS_ID: string | undefined = undefined;

    @Env({type: "string", required: false})
    KOREAN_PINNED_STATUS_ID: string | undefined = undefined;

    @Env({type: "string", required: true})
    ADDRESS_OF_MEMEZATOR_OFFICIAL: string;

    @Env({type: "string", required: true})
    PROM_TOKENS_CONTRACT_ADDRESS: string;

    @Env({type: "string", required: true})
    MEMEZATOR_PRIZE_FUND_ACCOUNT_ADDRESS: string;

    @Env({type: "string", required: true})
    MEMEZATOR_PRIZE_FUND_ACCOUNT_PRIVATE_KEY: string;

    @Env({type: "string", required: true})
    VOTING_POWER_PURCHASE_ADDRESS: string;

    @Env({type: "number", required: true})
    PROM_TO_VOTING_POWER_RATIO: number;

    additionalConfig: AdditionalJsonConfig = additionalJsonConfig;
}
