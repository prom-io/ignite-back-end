import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";

@Entity({ name: "voting_power_purchase" })
export class VotingPowerPurchase {
  @PrimaryColumn()
  id: string

  @CreateDateColumn()
  createdAt: Date

  @Column({type: 'varchar'})
  userId: string

  @Column({ type: "uuid" })
  txnId: string

  @Column({ type: "varchar" })
  txnHash: string

  @Column({ type: "timestamptz" })
  txnDate: Date

  @Column({ type: "numeric" })
  txnSum: string

  @Column({ type: "float" })
  votingPower: number
}