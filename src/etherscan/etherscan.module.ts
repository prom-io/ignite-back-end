import { Module } from "@nestjs/common";
import { EtherscanService } from "./etherscan.service";
import { config } from "../config";

@Module({
  providers: [
    EtherscanService,
  ],
  exports: [EtherscanService],
})
export class EtherscanModule {}
