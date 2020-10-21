import { TransactionSubject } from './types/TransactionSubject.enum';
import { TransactionStatus } from './types/TransactionStatus.enum';
import { NotStartedRewardTxnsIdsAndReceiverAndRewardsSum } from './types/NotStartedRewardTxnsIdsAndReceiverAndRewardsSum.interface';
import { NotStartedRewardsTransactions } from './entities/NotStartedRewardTransactions';
import { EntityRepository, Repository } from "typeorm";


@EntityRepository(NotStartedRewardsTransactions)
export class NotStartedRewardsTransactionsRepository extends Repository<NotStartedRewardsTransactions> { }