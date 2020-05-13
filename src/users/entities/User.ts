import {Column, Entity, ManyToOne, OneToOne, PrimaryColumn} from "typeorm";
import {UserPreferences} from "./UserPreferences";
import {MediaAttachment} from "../../media-attachments/entities";

@Entity()
export class User {
    @PrimaryColumn()
    id: string;

    @Column()
    ethereumAddress: string;

    @Column({nullable: true})
    privateKey?: string;

    @Column({nullable: true})
    displayedName: string;

    @Column({nullable: true})
    username: string;

    @Column()
    createdAt: Date;

    @Column()
    remote: boolean;

    @Column({nullable: true})
    avatarUri?: string;

    @ManyToOne(() => MediaAttachment, {nullable: true, eager: true})
    avatar?: MediaAttachment;

    @Column({nullable: true})
    btfsHash?: string = undefined;

    @Column({nullable: true})
    peerIp?: string;

    @Column({nullable: true})
    peerWallet?: string;

    @Column({nullable: true})
    btfsCid?: string;

    @Column({nullable: true})
    bio?: string;

    @OneToOne(() => UserPreferences, {nullable: true, eager: true})
    preferences?: UserPreferences;
}
