import { HttpException, Injectable } from '@nestjs/common';
import { NestSchedule, Cron } from "nest-schedule";
import { config } from '../config';
import { VotingPowerPurchase } from './entities/VotingPowerPurchase';
import { VotingPowerPurchaseRepository } from './voting-power-purchase.repository';
import { TokenExchangeService } from '../token-exchange';
import { UsersRepository } from '../users';
import { TransactionSubject } from '../transactions/types/TransactionSubject.enum';
import uuid from 'uuid';
import { TransactionsRepository } from '../transactions/TransactionsRepository';
import { LoggerService } from 'nest-logger';

@Injectable()
export class VotingPowerPurchaseCronService extends NestSchedule {
    constructor(
        private readonly transactionsRep: TransactionsRepository,
        private readonly tokenExchangeService: TokenExchangeService,
        private readonly votingPowerPurchaseRepository: VotingPowerPurchaseRepository,
        private readonly usersRepository: UsersRepository,
        private readonly logger: LoggerService
      ) {
        super()
      }

    @Cron('* 60 * * * *')
    public async getVotingPowerPurchaseTransactions(){
      const transactions = await this.tokenExchangeService.getIncomingTokenTransfersToVotingPowerPurchaseAccount();
      for (const transaction of transactions){
        const user = await this.usersRepository.findByEthereumAddress(transaction.addressFrom);
        const votingPowerPurchaseExist = await this.votingPowerPurchaseRepository.findOne({where: {txnHash: transaction.txnHash}})
        if (!votingPowerPurchaseExist) {
        const newVotingPowerPurchase = this.votingPowerPurchaseRepository.create({
          id: uuid(),
          createdAt: new Date(),
          txnHash: transaction.txnHash,
          txnDate: transaction.txnDate,
          userId: user.id,
          tokenQnt: transaction.tokenQnt,
          votingPower: parseFloat(transaction.tokenQnt) * config.PROM_TO_VOTING_POWER_RATIO
        });
        await this.votingPowerPurchaseRepository.save(newVotingPowerPurchase);
      }
      }
    }
}
