import { Injectable } from "@nestjs/common";
import { TransactionsRepository } from "./TransactionsRepository";
import { Transaction } from "./entities/Transaction";
import { TokenExchangeService } from "../token-exchange";
import { config } from "../config";
import { TransactionStatus } from "./types/TransactionStatus.enum";

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly tokenExchangeService: TokenExchangeService,
  ) {}

  public async performTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    return Promise.all(transactions.map(transaction => this.performTransaction(transaction)))
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
}
