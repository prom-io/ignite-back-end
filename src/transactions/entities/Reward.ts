import { TokenTransfer } from '../../bsc-api/types';
import { TransactionStatus } from '../types/TransactionStatus.enum';
import { Column, PrimaryColumn, Entity } from "typeorm";


@Entity({ name: "rewards" })
export class Reward {

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
    txnTo: string;

    @Column({ type: "numeric" })
    txnSum: string;

    @Column({ type: "varchar" })
    txnId: string;

    @Column({ type: "jsonb" })
    txnDetails: {
        tokenTransfer?: TokenTransfer,
        memezatorContestResultId?: string,
    };

    constructor(fields: Reward) {
        Object.assign(this, fields)
    }
}