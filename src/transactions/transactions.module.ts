import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionsRepository } from "./TransactionsRepository";
import { TokenExchangeModule } from "../token-exchange";
import { TransactionsController } from "./transactions.controller";
import { TransactionMapper } from "./TransactionMapper";
import { TransactionsPerformerCronService } from "./transactions-performer-cron.service";
import { BscApiModule } from "../bsc-api/bsc-api.module";
import { TransactionsWithBlockchainSync } from "./transactions-with-blockchain-sync.service";

@Module({
    imports: [
        BscApiModule,
        TypeOrmModule.forFeature([TransactionsRepository]),
        TokenExchangeModule,
    ],
    providers: [
        TransactionsService,
        TransactionMapper,
        TransactionsPerformerCronService,
        TransactionsWithBlockchainSync,
    ],
    exports: [TransactionsService],
    controllers: [TransactionsController],
})
export class TransactionsModule {}
