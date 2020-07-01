import {Module} from "@nestjs/common";
import Axios from "axios";
import {PasswordHashApiClient} from "./PasswordHashApiClient";
import {config} from "../config";

@Module({
    providers: [
        {
            provide: "passwordHashApiAxiosInstance",
            useValue: Axios.create({
                baseURL: `${config.IGNITE_PASSWORD_HASH_API_BASE_URL}/api/v1`
            })
        },
        PasswordHashApiClient
    ],
    exports: [PasswordHashApiClient]
})
export class PasswordHashApiModule {

}
