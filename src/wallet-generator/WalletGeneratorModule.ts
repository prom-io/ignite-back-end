import {Module} from "@nestjs/common";
import Axios from "axios";
import {WalletGeneratorController} from "./WalletGeneratorController";
import {WalletGeneratorApiClient} from "./WalletGeneratorApiClient";
import {config} from "../config";

@Module({
    controllers: [WalletGeneratorController],
    providers: [
        {
            provide: "walletGeneratorAxiosInstance",
            useValue: Axios.create({
                baseURL: `${config.PROMETEUS_WALLET_GENERATOR_API_BASE_URL}/api/v1`
            })
        },
        WalletGeneratorApiClient
    ]
})
export class WalletGeneratorModule {
}
