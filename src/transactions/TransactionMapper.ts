import { transactionDirection } from './TransactionDirection';
import { User } from './../users/entities/User';
import { Transaction } from "./entities/Transaction";
import { TransactionResponse } from "./types/responses/TransactionResponse";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TransactionMapper {
  public toTransactionResponses(transactions: Transaction[], currentUser: User): TransactionResponse[] {
    return transactions.map(transaction => this.toTransactionResponse(transaction, currentUser))
  }

  public toTransactionResponse(transaction: Transaction, currentUser: User): TransactionResponse {
    return new TransactionResponse({
      ...transaction,
      txnDirection: currentUser.ethereumAddress === transaction.txnTo ? transactionDirection.OUT : transactionDirection.IN,
      ethereumAddress: currentUser.ethereumAddress
    })
  }
}
