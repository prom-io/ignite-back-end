import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionsRepository } from "./TransactionsRepository";
import { TokenExchangeModule } from "../token-exchange";
import { TransactionsController } from "./transactions.controller";
import { TransactionMapper } from "./TransactionMapper";
import { TransactionsPerformerCronService } from "./transactions-performer-cron.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionsRepository]),
    TokenExchangeModule,
  ],
  providers: [TransactionsService, TransactionMapper, TransactionsPerformerCronService],
  exports: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
