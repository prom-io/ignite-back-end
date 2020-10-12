import { Injectable, Logger } from '@nestjs/common';
import { NestSchedule, Cron } from "nest-schedule";
import { config } from '../config';
import { VotingPowerPurchaseRepository } from './voting-power-purchase.repository';
import { UsersRepository } from '../users';
import uuid from 'uuid';
import { TransactionsRepository } from '../transactions/TransactionsRepository';
import { getCurrentMemezatorContestStartTime } from './utils';
import { MoreThanOrEqual } from 'typeorm';


@Injectable()
export class VotingPowerPurchaseCronService extends NestSchedule {
    constructor(
        private readonly transactionsRep: TransactionsRepository,
        private readonly votingPowerPurchaseRepository: VotingPowerPurchaseRepository,
        private readonly usersRepository: UsersRepository,
        private readonly logger: Logger
      ) {
        super()
      }

    @Cron('0 * * * * *')
    public async getVotingPowerPurchaseTransactions(){
      const memezatorContestStartTime = getCurrentMemezatorContestStartTime();
      const transactions = await this.transactionsRep.find({where: {txnTo:config.VOTING_POWER_PURCHASE_ADDRESS, txnDate: MoreThanOrEqual(memezatorContestStartTime)}});
      for (const transaction of transactions){
        this.logger.log(`${transaction.id}`);
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
        this.logger.log(`New voting power purchase: ${newVotingPowerPurchase.id}`)
      } else {
        this.logger.warn(`Record for transaction ${transaction.id} already exists.`)
      }
      }
    }
}
