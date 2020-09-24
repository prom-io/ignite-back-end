import { LikeAndVotingPowerAndReward } from './../types';
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "memezator_contest_results" })
export class MemezatorContestResult {
  @PrimaryColumn()
  id: string

  @Column()
  createdAt: Date

  @Column()
  updatedAt: Date

  @Column({ type: "json" })
  result: object

  @Column({type: "jsonb"})
  top10WinnersByLikes: LikeAndVotingPowerAndReward[] = []

  @Column()
  competitionStartDate: Date
}
