import { Repository, EntityRepository, FindConditions } from "typeorm";
import { Transaction } from "./entities/Transaction";
import { User } from "../users/entities";
import { GetTransactionsFilters } from "./types/requests/GetTransactionsFilters";

@EntityRepository(Transaction)
export class TransactionsRepository extends Repository<Transaction> {
  async getBalanceByAddress(address: string): Promise<string> {
    const rawResult = await this.createQueryBuilder("transaction")
      .select(`SUM(transaction."txnSum") as balance`)
      .where(`transaction."txnTo" = :address`, { address })
      .getRawOne()

    return (rawResult.balance || "0") as string
  }

  async findByUser(user: User, filters: GetTransactionsFilters): Promise<Transaction[]> {
    const commonConditions: FindConditions<Transaction> = {}

    if (filters.txnHash) {
      commonConditions.txnHash = filters.txnHash
    }

    if (filters.txnStatus) {
      commonConditions.txnStatus = filters.txnStatus
    }

    return this.find({
      where: [
        { txnTo: user.ethereumAddress, ...commonConditions },
        { txnFrom: user.ethereumAddress, ...commonConditions },
      ],
      take: filters.take,
      skip: filters.skip,
    })
  }
}
