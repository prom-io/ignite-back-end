import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class UserStatistics {
    @PrimaryColumn()
    id: string;

    @Column({type: "int"})
    statusesCount: number;

    @Column({type: "int"})
    followsCount: number;

    @Column({type: "int"})
    followersCount: number;

    @Column()
    balance: string

    @Column({ type: "int" })
    memezatorVoteWeight: number;

    @OneToOne(type => User)
    @JoinColumn()
    user: User;
}
