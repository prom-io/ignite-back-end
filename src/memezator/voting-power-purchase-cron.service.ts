import { Injectable } from '@nestjs/common';
import { NestSchedule, Cron } from "nest-schedule";
import { config } from '../config';
import { VotingPowerPurchaseRepository } from './voting-power-purchase.repository';
import { UsersRepository } from '../users';
import uuid from 'uuid';
import { TransactionsRepository } from '../transactions/TransactionsRepository';


@Injectable()
export class VotingPowerPurchaseCronService extends NestSchedule {
    constructor(
        private readonly transactionsRep: TransactionsRepository,
        private readonly votingPowerPurchaseRepository: VotingPowerPurchaseRepository,
        private readonly usersRepository: UsersRepository
      ) {
        super()
      }

    @Cron('0 * * * * *')
    public async getVotingPowerPurchaseTransactions(){
      const transactions = await this.transactionsRep.find({where: {txnTo:config.VOTING_POWER_PURCHASE_ADDRESS}});
      for (const transaction of transactions){
        const user = await this.usersRepository.findByEthereumAddress(transaction.txnFrom);
        const votingPowerPurchaseExist = await this.votingPowerPurchaseRepository.findOne({where: {
          txnHash: transaction.txnHash, 
          txnDate: transaction.txnDate, 
          txnFrom: transaction.txnFrom,
          txnSum: transaction.txnSum,
          txnId: transaction.id
        }})
        if (!votingPowerPurchaseExist) {
        const newVotingPowerPurchase = this.votingPowerPurchaseRepository.create({
          id: uuid(),
          createdAt: new Date(),
          txnHash: transaction.txnHash,
          txnDate: transaction.txnDate,
          userId: user.id,
          txnSum: transaction.txnSum,
          votingPower: parseFloat(transaction.txnSum) * config.PROM_TO_VOTING_POWER_RATIO
        });
        await this.votingPowerPurchaseRepository.save(newVotingPowerPurchase);
      }
      }
    }
}
