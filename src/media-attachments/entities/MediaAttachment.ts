import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class MediaAttachment {
    @PrimaryColumn()
    id: string;

    @Column()
    mimeType: string;

    @Column()
    format: string;

    @Column({nullable: true})
    width?: number;

    @Column({nullable: true})
    height?: number;

    @Column({nullable: true})
    name: string;

    @Column({nullable: true})
    siaLink?: string;

    @Column({nullable: true})
    btfsCid?: string;

    @Column({nullable: true})
    peerIp?: string;

    @Column({nullable: true})
    peerWallet?: string
}
