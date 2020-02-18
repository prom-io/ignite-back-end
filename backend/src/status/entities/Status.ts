import {Column, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {User} from "../../users/entities/User";

@Entity()
export class Status {
    @PrimaryColumn()
    id: string;

    @Column({type: "varchar", length: 250})
    text: string;

    @ManyToOne(type => User)
    author: User;

    @Column()
    remote: boolean;

    @Column()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
