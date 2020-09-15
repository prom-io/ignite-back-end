import {ClassSerializerInterceptor, Controller, Post, UseInterceptors} from "@nestjs/common";
import {WalletGeneratorApiClient} from "./WalletGeneratorApiClient";
import {GenerateWalletResponse} from "./types/response";
import { RateLimit, RateLimiterInterceptor } from "nestjs-rate-limiter";

@Controller("api/v1/wallet")
export class WalletGeneratorController {
    constructor(private readonly walletGeneratorApiClient: WalletGeneratorApiClient) {
    }

    @UseInterceptors(RateLimiterInterceptor, ClassSerializerInterceptor)
    // one request per 1h per IP
    @RateLimit({ points: 1, duration: 60 * 60 })
    @Post()
    public generateWallet(): Promise<GenerateWalletResponse> {
        return this.walletGeneratorApiClient.generateWallet();
    }
}
