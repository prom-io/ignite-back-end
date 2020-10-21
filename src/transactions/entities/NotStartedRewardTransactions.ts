import { TokenTransfer } from './../../bsc-api/types';
import { TransactionSubject } from './../types/TransactionSubject.enum';
import { TransactionStatus } from './../types/TransactionStatus.enum';
import { Column, PrimaryColumn, Entity } from "typeorm";


@Entity()
export class NotStartedRewardsTransactions {

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
    txnDetails: {
        tokenTransfer?: TokenTransfer,
        memezatorContestResultId?: string,
    };

    constructor(fields: NotStartedRewardsTransactions) {
        Object.assign(this, fields)
    }
}