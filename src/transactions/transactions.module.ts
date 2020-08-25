import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionsRepository } from "./TransactionsRepository";

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionsRepository])
  ],
  providers: [TransactionsService],
})
export class TransactionsModule {}
