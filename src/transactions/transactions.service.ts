import { Injectable } from "@nestjs/common";
import { TransactionsRepository } from "./TransactionsRepository";
import { Transaction } from "./entities/Transaction";
import { TokenExchangeService } from "../token-exchange";
import { config } from "../config";
import { TransactionStatus } from "./types/TransactionStatus.enum";
import { User } from "../users/entities";
import { TransactionResponse } from "./types/responses/TransactionResponse";
import { GetTransactionsFilters } from "./types/requests/GetTransactionsFilters";
import { TransactionMapper } from "./TransactionMapper";
import { LoggerService } from "nest-logger";
import { RefreshTransactionsRequest } from "./types/requests/RefreshTransactionsRequest";
import uuid from "uuid";

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly tokenExchangeService: TokenExchangeService,
    private readonly transactionsMapper: TransactionMapper,
    private readonly logger: LoggerService,
  ) {}

  public async performTransactionsByIds(transactionsIds: string[]): Promise<Transaction[]> {
    this.logger.info(`performTransactionsByIds: Performing transactions with ${transactionsIds.length} transaction ids: ${JSON.stringify(transactionsIds)}`);
    const transactions = await this.transactionsRepository.findByIds(transactionsIds)
    this.logger.info(`performTransactionsByIds: Found ${transactions.length} transactions. Started performing`);
    const completeTransactions = await this.performTransactions(transactions)
    this.logger.info(`performTransactionsByIds: Performed ${completeTransactions.length} out of ${transactions.length} transactions`)
    return completeTransactions;
  }

  /**
   * Don't use `Promise.all` instead of `for`, and do not parallel invocations of performTransaction(),
   * because the ignite-token-exchange service expects the exchanges to be sequenced
   * because of some implementation details of Binance.
   */
  public async performTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    const completeTransactions: Transaction[] = []

    for (const transaction of transactions) {
      await this.performTransaction(transaction)
        .then(resultingTransaction => {
          completeTransactions.push(resultingTransaction)
          this.logger.info(`performTransactions: transaction complete: ${JSON.stringify(resultingTransaction)}`)
        })
        .catch(err => {
          this.logger.error(`performTransactions: error occurred: ${JSON.stringify(err)}`)
        })
    }

    return completeTransactions
  }

  public async performTransaction(transaction: Transaction): Promise<Transaction> {
    const transactionHash = await this.tokenExchangeService.sendTokens({
      addressTo: transaction.txnTo,
      amount: +transaction.txnSum,
      privateKeyFrom: config.MEMEZATOR_PRIZE_FUND_ACCOUNT_PRIVATE_KEY,
    })

    transaction.txnHash = transactionHash
    transaction.txnDate = new Date()
    transaction.txnStatus = TransactionStatus.PERFORMED

    await this.transactionsRepository.save(transaction)

    return transaction
  }

  public async getTransactions(user: User, filters: GetTransactionsFilters): Promise<TransactionResponse[]> {
    const transactions = await this.transactionsRepository.findByUser(user, filters)
    return this.transactionsMapper.toTransactionResponses(transactions)
  }

  public async refreshTransactions(param: RefreshTransactionsRequest){
    const transactions = await this.tokenExchangeService.getTransactions();

    for (const transaction of transactions) {
      const transactionRecord = await this.transactionsRepository.findOne({where: {txnHash: transaction.txnHash}})

      if (!transactionRecord){
        const newTransaction = this.transactionsRepository.create({
          id: uuid(),
          createdAt: new Date(),
          txnDate: transaction.txnDate,
          txnFrom: transaction.addressFrom,
          txnTo: transaction.addressTo,
          txnHash: transaction.txnHash,
          txnSum: transaction.tokenQnt,
          txnStatus: transaction.txnStatus,
        })
        await this.transactionsRepository.save(newTransaction);
      } else if (transactionRecord.txnStatus != transaction.txnStatus){
        await this.transactionsRepository.update({id: transactionRecord.id}, {txnStatus: transaction.txnStatus})
      }
    }
  }
}
