import {Column, Entity, Index, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "../../users/entities";

@Entity()
export class UserSubscription {
    @PrimaryColumn()
    id: string;

    @ManyToOne(type => User, {eager: true})
    @Index()
    subscribedUser: User;

    @ManyToOne(type => User, {eager: true})
    @Index()
    subscribedTo: User;

    @Column()
    createdAt: Date;

    @Column({nullable: true})
    reverted: boolean = false;

    @Column({nullable: true})
    revertedAt?: Date;

    @Column({nullable: true})
    btfsHash?: string = undefined;

    @Column({nullable: true})
    peerIp?: string;

    @Column({nullable: true})
    peerWallet?: string;

    @Column({default: false})
    isSubscribedToCommunity: boolean

    @Column({nullable: true})
    saveUnsubscriptionToBtfs?: boolean = false;
}
