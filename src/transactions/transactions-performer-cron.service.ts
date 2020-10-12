import { Injectable } from "@nestjs/common";
import { LoggerService } from "nest-logger";
import { NestSchedule, Cron } from "nest-schedule";
import { In } from "typeorm";
import { TokenExchangeService } from "../token-exchange";
import { TransactionsRepository } from "./TransactionsRepository";
import { TransactionStatus } from "./types/TransactionStatus.enum";
import _ from "lodash";
import { NotStartedRewardTxnsIdsAndReceiverAndRewardsSum } from "./types/NotStartedRewardTxnsIdsAndReceiverAndRewardsSum.interface";

@Injectable()
export class TransactionsPerformerCronService extends NestSchedule {
  constructor(
    private readonly logger: LoggerService,
    private readonly transactionsRep: TransactionsRepository,
    private readonly tokenExchangeService: TokenExchangeService,
  ) {
    super()
  }

  /**
   * В 12 часов утра каждый понедельник
   * 
   * @todo implement
   */
  @Cron("0 12 * * 1", {waiting: true})
  public async performNotStartedRewardTransactionsCron(): Promise<void> {
    this.logger.info("performNotStartedRewardTransactionsCron: cron tick")
  }

  public async performNotStartedRewardTransactions(options: { receiversLimit?: number }): Promise<void> {
    this.logger.info(`performNotStartedRewardTransactions: called with options: ${JSON.stringify(options)}`)

    const rewardReceiversWithRewardsSumsAndTxnIds = await this.transactionsRep.getNotStartedRewardTxnsIdsAndReceiversAndRewardsSums({
      receiversLimit: options.receiversLimit
    })

    await this.performSpecifiedNotStartedRewardTransactions(rewardReceiversWithRewardsSumsAndTxnIds)
  }

  public async performSpecifiedNotStartedRewardTransactions(
    rewardReceiversWithRewardsSumsAndTxnIds: NotStartedRewardTxnsIdsAndReceiverAndRewardsSum[]
  ) {
    this.logger.info(`performNotStartedRewardTransactions: found ${rewardReceiversWithRewardsSumsAndTxnIds.length} reward receivers`)

    for (const rewardReceiverWithRewardsSumAndTxnIds of rewardReceiversWithRewardsSumsAndTxnIds) {
      try {
        this.logger.info(`performNotStartedRewardTransactions: processing ${JSON.stringify(rewardReceiverWithRewardsSumAndTxnIds)}`)

        const result = await this.checkIfTransactionsAreStillInNotStartedStatus(rewardReceiverWithRewardsSumAndTxnIds.txnIds)

        if (!result.allSpecifiedTransactionsAreNotStarted) {
          this.logger.error(
            `performNotStartedRewardTransactions: Transactions of ${JSON.stringify(rewardReceiverWithRewardsSumAndTxnIds)} have been changed since aggregation. ` +
            `Current transactions in NOT_STARTED status are: ${JSON.stringify(result.currentNotStartedTransactionsIds)}. ` + 
            `Following statuses are not with NOT_STARTED status anymore: ${JSON.stringify(result.idsOfStatusesNotInNotStartedStatus)}`
          )

          continue;
        }

        await this.transactionsRep.update(
          {
            id: In(rewardReceiverWithRewardsSumAndTxnIds.txnIds),
          },
          {
            txnStatus: TransactionStatus.PERFORMING,
          },
        );

        const txnDate = new Date();
        const txnHash: string = await this.tokenExchangeService.sendTokensFromMemezatorPrizeFund({
          addressTo: rewardReceiverWithRewardsSumAndTxnIds.txnTo,
          amount: parseFloat(rewardReceiverWithRewardsSumAndTxnIds.rewardsSum),
        });

        this.logger.info(`performNotStartedRewardTransactions: transaction performed for ${JSON.stringify(rewardReceiverWithRewardsSumAndTxnIds)} with hash: ${txnHash}`)

        await this.transactionsRep.update(
          {
            id: In(rewardReceiverWithRewardsSumAndTxnIds.txnIds),
          },
          {
            txnHash,
            txnDate,
            txnStatus: TransactionStatus.PERFORMED,
          },
        );

        this.logger.info(`performNotStartedRewardTransactions: transaction hash ${txnHash} recorded to DB for receiver ${rewardReceiverWithRewardsSumAndTxnIds.txnTo}`)
      } catch (error) {
        this.logger.error(`performNotStartedRewardTransactions: error occurred ${error}`)
        await this.transactionsRep.update(
          {
            id: In(rewardReceiverWithRewardsSumAndTxnIds.txnIds),
          },
          {
            txnStatus: TransactionStatus.PROBLEM,
          },
        );
      }
    }

    this.logger.info(`performNotStartedRewardTransactions: processed ${rewardReceiversWithRewardsSumsAndTxnIds.length} reward receivers`)
  }

  private async checkIfTransactionsAreStillInNotStartedStatus(transactionIds: string[]) {
    const currentNotStartedTransactionsIds: string[] = await this.transactionsRep.find({
      select: ["id"],
      where: {
        id: In(transactionIds),
        txnStatus: TransactionStatus.NOT_STARTED,
      }
    }).then(transactions => _.map(transactions, "id"))

    const idsOfStatusesNotInNotStartedStatus =
      _.differenceBy(transactionIds, currentNotStartedTransactionsIds, _.toLower);

    const result = {
      allSpecifiedTransactionsAreNotStarted: idsOfStatusesNotInNotStartedStatus.length === 0,
      specifiedTransactionsIds: transactionIds,
      currentNotStartedTransactionsIds,
      idsOfStatusesNotInNotStartedStatus,
    }

    return result;
  }
}
