import { Module } from "@nestjs/common";
import { MemezatorService } from "./memezator.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StatusesRepository } from "../statuses/StatusesRepository";
import { StatusLikesRepository } from "../statuses/StatusLikesRepository";
import { MemezatorController } from "./memezator.controller";
import { StatusesModule } from "../statuses";
import { UsersRepository } from "../users";
import { MemezatorContestResultRepository } from "./memezator-contest-result.repository";
import { TransactionsRepository } from "../transactions/TransactionsRepository";
import { ScheduleModule } from "nest-schedule";
import { TokenExchangeModule } from "../token-exchange";
import { TransactionsModule } from "../transactions/transactions.module";
import { VotingPowerPurchaseRepository } from "./voting-power-purchase.repository";

@Module({
  imports: [
    StatusesModule,
    ScheduleModule.register(),
    TokenExchangeModule,
    TransactionsModule,
    TypeOrmModule.forFeature([
      TransactionsRepository,
      MemezatorContestResultRepository,
      StatusesRepository,
      StatusLikesRepository,
      UsersRepository,
      VotingPowerPurchaseRepository
    ])
  ],
  providers: [MemezatorService],
  controllers: [MemezatorController],
})
export class MemezatorModule {}
