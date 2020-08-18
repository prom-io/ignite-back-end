import { Module } from "@nestjs/common";
import { MemezatorService } from "./memezator.service";
import { EtherscanModule } from "../etherscan";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StatusesRepository } from "../statuses/StatusesRepository";
import { HashTagsRepository } from "../statuses/HashTagsRepository";
import { StatusLikesRepository } from "../statuses/StatusLikesRepository";
import { MemezatorController } from "./memezator.controller";

@Module({
  imports: [
    EtherscanModule,
    TypeOrmModule.forFeature([
      StatusesRepository,
      HashTagsRepository,
      StatusLikesRepository,
    ])
  ],
  providers: [MemezatorService],
  controllers: [MemezatorController],
})
export class MemezatorModule {}
