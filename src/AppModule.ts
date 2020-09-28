import { Request } from 'express';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import {Module, BadRequestException} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {LoggerModule} from "./logging";
import {Web3Module} from "./web3";
import {BCryptModule} from "./bcrypt";
import {AuthModule} from "./jwt-auth";
import {StatusesModule} from "./statuses";
import {UserSubscriptionsModule} from "./user-subscriptions";
import {UsersModule} from "./users";
import {entities} from "./typeorm-entities";
import {subscribers} from "./typeorm-subscribers";
import {MicrobloggingBlockchainApiModule} from "./microblogging-blockchain-api";
import {MediaAttachmentsModule} from "./media-attachments";
import {SkynetModule} from "./skynet";
import {BtfsModule} from "./btfs-sync";
import {DefaultAccountProviderModule} from "./default-account-provider/DefaultAccountProviderModule";
import {WalletGeneratorModule} from "./wallet-generator";
import {PasswordHashApiModule} from "./password-hash-api";
import {PasswordHashGeneratorModule} from "./passsword-hash-generator";
import {StatisticsModule} from "./statistics";
import {ValidationModule} from "./utils/validation";
import {MemezatorModule} from "./memezator/memezator.module";
import {TokenExchangeModule} from "./token-exchange";
import { StatisticsLogService } from "./statistics-log/statistics-log.service";

import { StatisticsLogModule } from "./statistics-log/statistics-log.module";
import { config } from './config';

@Module({
    imports: [
        StatisticsLogModule,
        LoggerModule,
        DefaultAccountProviderModule,
        Web3Module,
        BCryptModule,
        AuthModule,
        UsersModule,
        StatusesModule,
        UserSubscriptionsModule,
        MicrobloggingBlockchainApiModule,
        MediaAttachmentsModule,
        SkynetModule,
        BtfsModule,
        WalletGeneratorModule,
        PasswordHashApiModule,
        PasswordHashGeneratorModule,
        StatisticsModule,
        ValidationModule,
        MemezatorModule,
        TokenExchangeModule,
        TypeOrmModule.forRoot(
            {
                ...require("../ormconfig.js"),
                entities,
                subscribers,
            }
        ),
        {
            ...GoogleRecaptchaModule.forRoot({
                secretKey: config.GOOGLE_RECAPTCHA_SECRET_KEY,
                response: req => {
                    return req.headers["x-recaptcha"]
                },
                skipIf: (req: Request) => {
                    if(req.path === "/api/v1/sign-up" && req.method === "POST") {
                        return config.NODE_ENV !== "production" || config.additionalConfig.disableGoogleRecaptchaForSignUp === true
                    }
                    if(req.path === "/api/v1/statuses" && req.method === "POST") {
                        return config.NODE_ENV !== 'production' && req.body.fromMemezator !== true
                    }
                },
                onError: () => {
                    throw new BadRequestException('Invalid recaptcha.')
                }
            }),
            // кастильный метод
            global: true
        },
    ]
})
export class AppModule {

}
