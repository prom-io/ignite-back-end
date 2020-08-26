import { Entity, PrimaryColumn, Column } from "typeorm";
import { TransactionStatus } from "../types/TransactionStatus.enum";
import { TransactionSubject } from "../types/TransactionSubject.enum";

@Entity({ name: "transactions" })
export class Transaction {
  @PrimaryColumn()
  id: string;

  @Column({ type: "timestamptz" })
  createdAt: Date;

  @Column({ nullable: true })
  txnHash?: string;

  @Column({ type: "timestamptz", nullable: true })
  txnDate?: Date;

  @Column()
  txnStatus: TransactionStatus;

  @Column()
  txnFrom: string;

  @Column()
  txnTo: string;

  @Column({ type: "numeric" })
  txnSum: string;

  @Column({ type: "varchar" })
  txnSubj: TransactionSubject;

  @Column({ type: "jsonb" })
  txnDetails: object;

  constructor(fields: Transaction) {
    Object.assign(this, fields)
  }
}
