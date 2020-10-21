import { NotStartedRewardsTransactions } from './entities/NotStartedRewardTransactions';
import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionsRepository } from "./TransactionsRepository";
import { TokenExchangeModule } from "../token-exchange";
import { TransactionsController } from "./transactions.controller";
import { TransactionMapper } from "./TransactionMapper";
import { TransactionsPerformerCronService } from "./transactions-performer-cron.service";
import { VotingPowerPurchaseRepository } from "../memezator/voting-power-purchase.repository";
import { UsersRepository } from "../users";
import { BscApiModule } from "../bsc-api/bsc-api.module";
import { TransactionsWithBlockchainSync } from "./transactions-with-blockchain-sync.service";
import { VotingPowerPurchaseCronService } from "../memezator/voting-power-purchase-cron.service";

@Module({
    imports: [
        BscApiModule,
        TypeOrmModule.forFeature([
            TransactionsRepository,
            VotingPowerPurchaseRepository,
            UsersRepository,
            NotStartedRewardsTransactions
        ]),
        TokenExchangeModule,
    ],
    providers: [
        TransactionsService,
        TransactionMapper,
        TransactionsPerformerCronService,
        TransactionsWithBlockchainSync,
        VotingPowerPurchaseCronService,
    ],
    exports: [TransactionsService],
    controllers: [TransactionsController],
})
export class TransactionsModule { }
