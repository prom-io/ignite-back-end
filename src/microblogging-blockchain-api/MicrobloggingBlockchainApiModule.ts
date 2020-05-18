import {Module} from "@nestjs/common";
import Axios from "axios";
import {config} from "../config";
import {MicrobloggingBlockchainApiClient} from "./MicrobloggingBlockchainApiClient";

@Module({
    providers: [
        {
            provide: "microbloggingBlockchainApiAxiosInstance",
            useValue: Axios.create({
                baseURL: config.MICROBLOGGING_BLOCKCHAIN_API_URL
            })
        },
        MicrobloggingBlockchainApiClient
    ],
    exports: [MicrobloggingBlockchainApiClient]
})
export class MicrobloggingBlockchainApiModule {
}
