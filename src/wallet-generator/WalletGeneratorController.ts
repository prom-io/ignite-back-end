import {ClassSerializerInterceptor, Controller, Post, UseInterceptors, BadRequestException} from "@nestjs/common";
import {WalletGeneratorApiClient} from "./WalletGeneratorApiClient";
import {GenerateWalletResponse} from "./types/response";
import { RateLimit, RateLimiterInterceptor } from "nestjs-rate-limiter";
import moment from "moment";

@Controller("api/v1/wallet")
export class WalletGeneratorController {
    private lastWalletCreationDate: moment.Moment = null;
    constructor(private readonly walletGeneratorApiClient: WalletGeneratorApiClient) {}

    @UseInterceptors(ClassSerializerInterceptor, RateLimiterInterceptor)
    @RateLimit({ points: 1, duration: 60 * 60 })
    @Post()
    public generateWallet(): Promise<GenerateWalletResponse> {
        if (moment().diff(this.lastWalletCreationDate, "minutes") >= 2) {
            return null
        }

        this.lastWalletCreationDate = moment();

        return this.walletGeneratorApiClient.generateWallet();
    }
}
