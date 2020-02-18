import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "../../users/entities";

@Entity()
export class UserSubscription {
    @PrimaryColumn()
    id: string;

    @ManyToOne(type => User)
    subscribedUser: User;

    @ManyToOne(type => User)
    subscribedTo: User;

    @Column()
    createdAt: Date;
}
