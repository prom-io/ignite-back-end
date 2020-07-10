import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class UserNotWrittenToBinanceChain {
    @PrimaryColumn()
    id: string;

    @Column()
    privateKey: string;

    @ManyToOne(() => User, {eager: true})
    user: User;
    
    @Column()
    createdAt: Date;
}
