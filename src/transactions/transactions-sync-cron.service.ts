import { Injectable } from '@nestjs/common';
import { NestSchedule, Cron } from "nest-schedule";
import { VotingPowerPurchase } from '../memezator/entities/VotingPowerPurchase';
import { TokenExchangeService } from '../token-exchange';
import { TransactionsRepository } from './TransactionsRepository';

@Injectable()
export class TransactionsSyncCronService extends NestSchedule {
    constructor(
        private readonly transactionsRep: TransactionsRepository,
        private readonly tokenExchangeService: TokenExchangeService,
        private readonly votingPowerPurchase: VotingPowerPurchase
      ) {
        super()
      }

    @Cron('* 60 * * * *')
    public async synchronizeTransactions(){}
}
