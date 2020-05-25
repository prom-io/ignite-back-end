import {ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors} from "@nestjs/common";
import {WalletGeneratorApiClient} from "./WalletGeneratorApiClient";
import {GenerateWalletResponse} from "./types/response";

@Controller("api/v1/wallet")
export class WalletGeneratorController {
    constructor(private readonly walletGeneratorApiClient: WalletGeneratorApiClient) {
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    public generateWallet(): Promise<GenerateWalletResponse> {
        return this.walletGeneratorApiClient.generateWallet();
    }
}
