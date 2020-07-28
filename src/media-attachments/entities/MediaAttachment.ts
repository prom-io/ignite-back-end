import {Column, Entity, PrimaryColumn, OneToOne, JoinColumn, ManyToOne, OneToMany, Index} from "typeorm";

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
    peerWallet?: string;

    @Column({type: "integer", nullable: true})
    previewSize?: number;

    @Column({nullable: true})
    @Index()
    originalId?: string

    @OneToMany(() => MediaAttachment, preview => preview.original, { nullable: true })
    previews?: MediaAttachment[];

    @ManyToOne(type => MediaAttachment, original => original.previews, { nullable: true })
    @JoinColumn({ name: "originalId" })
    original?: MediaAttachment;
}
