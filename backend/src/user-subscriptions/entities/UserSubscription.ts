import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "../../users/entities";

@Entity()
export class UserSubscription {
    @PrimaryColumn()
    id: string;

    @ManyToOne(type => User, {eager: true})
    subscribedUser: User;

    @ManyToOne(type => User, {eager: true})
    subscribedTo: User;

    @Column()
    createdAt: Date;
}
