import { Module } from "@nestjs/common";
import { MemezatorService } from "./memezator.service";
import { EtherscanModule } from "../etherscan";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StatusesRepository } from "../statuses/StatusesRepository";
import { HashTagsRepository } from "../statuses/HashTagsRepository";
import { StatusLikesRepository } from "../statuses/StatusLikesRepository";
import { MemezatorController } from "./memezator.controller";
import { StatusesModule } from "../statuses";
import { UsersRepository } from "../users";

@Module({
  imports: [
    EtherscanModule,
    StatusesModule,
    TypeOrmModule.forFeature([
      StatusesRepository,
      HashTagsRepository,
      StatusLikesRepository,
      UsersRepository,
    ])
  ],
  providers: [MemezatorService],
  controllers: [MemezatorController],
})
export class MemezatorModule {}
