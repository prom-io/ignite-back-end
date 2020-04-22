import {Column, Entity, PrimaryColumn} from "typeorm";

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

    @Column({nullable: true})
    btfsHash?: string = undefined;

    @Column({nullable: true})
    peerIp?: string;

    @Column({nullable: true})
    peerWallet?: string;

    @Column({nullable: true})
    btfsCid?: string;
}
