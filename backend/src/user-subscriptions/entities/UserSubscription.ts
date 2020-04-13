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

    @Column({nullable: true})
    btfsHash?: string = undefined;

    @Column({nullable: true})
    peerIp?: string;

    @Column({nullable: true})
    peerWallet?: string;
}
