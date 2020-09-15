import {Module} from "@nestjs/common";
import Axios from "axios";
import {WalletGeneratorController} from "./WalletGeneratorController";
import {WalletGeneratorApiClient} from "./WalletGeneratorApiClient";
import {config} from "../config";
import { RateLimiterModule } from "nestjs-rate-limiter";

@Module({
    imports: [
        RateLimiterModule,
    ],
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
