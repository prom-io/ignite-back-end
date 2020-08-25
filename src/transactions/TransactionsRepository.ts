import { Repository, EntityRepository } from "typeorm";
import { Transaction } from "./entities/Transaction";

@EntityRepository(Transaction)
export class TransactionsRepository extends Repository<Transaction> {
  async getBalanceByAddress(address: string): Promise<string> {
    const rawResult = await this.createQueryBuilder("transaction")
      .select(`SUM(transaction."txnSum") as balance`)
      .where(`transaction."txnTo" = :address`, { address })
      .getRawOne()

    return (rawResult.balance || "0") as string
  }
}
