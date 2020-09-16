import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import {Module, BadRequestException} from "@nestjs/common";
import Axios from "axios";
import {WalletGeneratorController} from "./WalletGeneratorController";

import {WalletGeneratorApiClient} from "./WalletGeneratorApiClient";
import {config} from "../config";

@Module({
    imports: [ 
        GoogleRecaptchaModule.forRoot({
        secretKey: config.GOOGLE_RECAPTCHA_SECRET_KEY,
        response: req => req.headers["x-recaptcha"],
        skipIf: req => config.NODE_ENV !== 'production',
        onError: () => {
            throw new BadRequestException('Invalid recaptcha.')
        }
    })],
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
