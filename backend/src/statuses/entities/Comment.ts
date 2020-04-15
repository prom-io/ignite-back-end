import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, Tree, TreeParent} from "typeorm";
import {User} from "../../users/entities";
import {Status} from "./index";
import {MediaAttachment} from "../../media-attachments/entities";

@Entity()
@Tree("materialized-path")
export class Comment {
    @PrimaryColumn()
    id: string;

    @Column()
    text: string;

    @ManyToOne(type => User, {eager: true})
    author: User;

    @ManyToOne(type => Status, {eager: true})
    status: Status;

    @TreeParent()
    repostedComment?: Comment;

    @Column()
    createdAt: Date;

    @Column({nullable: true})
    updatedAt: Date;

    @ManyToMany(() => MediaAttachment, {eager: true})
    @JoinTable()
    mediaAttachments: MediaAttachment[];

    @Column({nullable: true})
    btfsHash?: string;

    @Column({nullable: true})
    peerIp?: string;

    @Column({nullable: true})
    peerWallet?: string;
}
