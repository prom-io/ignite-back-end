import { Module } from "@nestjs/common";
import { EtherscanService } from "./etherscan.service";

@Module({
  providers: [
    EtherscanService,
  ],
  exports: [EtherscanService],
})
export class EtherscanModule {}
