import { Transaction } from "./entities/Transaction";
import { TransactionResponse } from "./types/responses/TransactionResponse";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TransactionMapper {
  public toTransactionResponses(transactions: Transaction[]): TransactionResponse[] {
    return transactions.map(transaction => this.toTransactionResponse(transaction))
  }

  public toTransactionResponse(transaction: Transaction): TransactionResponse {
    return new TransactionResponse(transaction)
  }
}
