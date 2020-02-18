import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {Status} from "./Status";
import {User} from "../../users/entities/User";

@Entity()
export class StatusLike {
    @PrimaryColumn()
    id: string;

    @ManyToOne(type => Status)
    status: Status;

    @ManyToOne(type => User)
    user: User;

    @Column()
    createdAt: Date;
}
