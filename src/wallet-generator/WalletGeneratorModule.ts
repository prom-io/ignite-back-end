import {MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common";
import Axios from "axios";
import {WalletGeneratorController} from "./WalletGeneratorController";
import {WalletGeneratorApiClient} from "./WalletGeneratorApiClient";
import {config} from "../config";
import expressRateLimit from "express-rate-limit";

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
export class WalletGeneratorModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                expressRateLimit({
                    windowMs: 10 * 60 * 1000,
                    max: 1,
                    skip: req => (config.additionalConfig.disableRateLimitForSignUpForIps || []).includes(req.ip),
                })
            )
            .forRoutes({ path: "api/v1/wallet", method: RequestMethod.POST });
    }
}
