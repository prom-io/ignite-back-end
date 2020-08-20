import { Module } from "@nestjs/common";
import { MemezatorService } from "./memezator.service";
import { EtherscanModule } from "../etherscan";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StatusesRepository } from "../statuses/StatusesRepository";
import { StatusLikesRepository } from "../statuses/StatusLikesRepository";
import { MemezatorController } from "./memezator.controller";
import { StatusesModule } from "../statuses";
import { UsersRepository } from "../users";
import { MemezatorContestResultRepository } from "./memezator-contest-result.repository";
import { TransactionsRepository } from "../transactions/TransactionsRepository";

@Module({
  imports: [
    EtherscanModule,
    StatusesModule,
    TypeOrmModule.forFeature([
      TransactionsRepository,
      MemezatorContestResultRepository,
      StatusesRepository,
      StatusLikesRepository,
      UsersRepository,
    ])
  ],
  providers: [MemezatorService],
  controllers: [MemezatorController],
})
export class MemezatorModule {}
