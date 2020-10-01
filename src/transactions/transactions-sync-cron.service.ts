import { Injectable } from '@nestjs/common';
import { NestSchedule, Cron } from "nest-schedule";
import { config } from '../config';
import { VotingPowerPurchase } from './entities/VotingPowerPurchase';
import { VotingPowerPurchaseRepository } from './voting-power-purchase.repository';
import { TokenExchangeService } from '../token-exchange';
import { UsersRepository } from '../users';
import { TransactionSubject } from './types/TransactionSubject.enum';
import uuid from 'uuid';
import { TransactionsRepository } from './TransactionsRepository';

@Injectable()
export class TransactionsSyncCronService extends NestSchedule {
    constructor(
        private readonly transactionsRep: TransactionsRepository,
        private readonly tokenExchangeService: TokenExchangeService,
        private readonly votingPowerPurchaseRepository: VotingPowerPurchaseRepository,
        private readonly usersRepository: UsersRepository
      ) {
        super()
      }

    //@Cron('* 60 * * * *')
    public async synchronizeTransactions(){
      const transactions = await this.tokenExchangeService.getTransactions();

      for (const transaction of transactions){
      
        const transactionRecord = await this.transactionsRep.findOne({where: {txnHash: transaction.txnHash}})
        const user = await this.usersRepository.findByEthereumAddress(transaction.addressFrom);
        const newVotingPowerPurchase = this.votingPowerPurchaseRepository.create({
          id: uuid(),
          createdAt: new Date(),
          txnHash: transaction.txnHash,
          txnDate: transaction.txnDate,
          userId: user.id,
          txnId: transactionRecord.id,
          tokenQnt: transaction.tokenQnt,
          votingPower: parseFloat(transaction.tokenQnt) * config.VOTING_POWER_CONST
        });
        await this.votingPowerPurchaseRepository.save(newVotingPowerPurchase);
      }
    }
}
