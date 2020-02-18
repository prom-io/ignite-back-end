import {Column, Entity, OneToOne, PrimaryColumn} from "typeorm";
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

    @OneToOne(type => User)
    user: User;
}
