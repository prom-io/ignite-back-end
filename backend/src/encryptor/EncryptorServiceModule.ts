import {Module} from "@nestjs/common";
import Axios from "axios";
import {EncryptorServiceClient} from "./EncryptorServiceClient";
import {config} from "../config";

@Module({
    providers: [
        {
            provide: "encryptorServiceAxios",
            useValue: Axios.create({
                baseURL: config.ENCRYPTOR_SERVICE_URL
            })
        },
        EncryptorServiceClient
    ],
    exports: [EncryptorServiceClient]
})
export class EncryptorServiceModule {}
