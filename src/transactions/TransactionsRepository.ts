import { Repository, EntityRepository } from "typeorm";
import { Transaction } from "./entities/Transaction";

@EntityRepository(Transaction)
export class TransactionsRepository extends Repository<Transaction> {}
