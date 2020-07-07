import {Column, Entity, Index, ManyToOne, PrimaryColumn} from "typeorm";
import {HashTag} from "./HashTag";
import {User} from "../../users/entities";

@Entity()
export class HashTagSubscription {
    @PrimaryColumn()
    id: string;

    @ManyToOne(() => User)
    @Index()
    user: User;

    @ManyToOne(() => HashTag)
    @Index()
    hashTag: HashTag;

    @Column()
    createdAt: Date;

    @Column()
    reverted: boolean;
}
