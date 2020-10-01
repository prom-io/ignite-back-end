import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionsRepository } from "./TransactionsRepository";
import { TokenExchangeModule } from "../token-exchange";
import { TransactionsController } from "./transactions.controller";
import { TransactionMapper } from "./TransactionMapper";
import { TransactionsPerformerCronService } from "./transactions-performer-cron.service";
import { VotingPowerPurchaseRepository } from "./voting-power-purchase.repository";
import { UsersRepository } from "../users";
import { TransactionsSyncCronService } from "./transactions-sync-cron.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionsRepository, VotingPowerPurchaseRepository, UsersRepository]),
    TokenExchangeModule,
  ],
  providers: [TransactionsService, TransactionMapper, TransactionsPerformerCronService, TransactionsSyncCronService],
  exports: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
