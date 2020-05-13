import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {Status} from "./Status";
import {User} from "../../users/entities/User";

@Entity()
export class StatusLike {
    @PrimaryColumn()
    id: string;

    @ManyToOne(type => Status, {eager: true})
    status: Status;

    @ManyToOne(type => User, {eager: true})
    user: User;

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

    @Column({nullable: true})
    saveUnlikeToBtfs?: boolean = true;
}
