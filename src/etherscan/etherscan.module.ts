import { Module } from "@nestjs/common";
import { EtherscanService } from "./etherscan.service";
import { config } from "../config";

@Module({
  providers: [
    {
      provide: EtherscanService,
      useFactory() {
        return new EtherscanService(config.ETHERSCAN_API_TOKEN)
      }
    }
  ],
  exports: [EtherscanService],
})
export class EtherscanModule {}
