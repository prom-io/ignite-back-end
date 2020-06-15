import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Index} from "typeorm";
import {User} from "./User";
import {MediaAttachment} from "../../media-attachments/entities";

@Entity()
export class UserDynamicFields {
    @PrimaryColumn()
    id: string;

    @ManyToOne(() => User, {nullable: false, eager: false})
    @JoinColumn()
    @Index()
    user?: User;

    @Column()
    @Index()
    username: string;

    @Column({nullable: true})
    displayedName?: string;

    @Column({nullable: true})
    passwordHash?: string;

    @ManyToOne(() => MediaAttachment, {nullable: true, eager: true})
    @JoinColumn()
    avatar?: MediaAttachment;

    @Column({nullable: true})
    bio?: string;

    @Column()
    @Index()
    createdAt: Date;
}
