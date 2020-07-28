import {Column, Entity, PrimaryColumn, OneToOne, JoinColumn} from "typeorm";

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

    @OneToOne(() => MediaAttachment, {cascade: true, onDelete: "SET NULL", persistence: true})
    @JoinColumn()
    preview128?: MediaAttachment;

    @OneToOne(() => MediaAttachment, {cascade: true, onDelete: "SET NULL", persistence: true})
    @JoinColumn()
    preview256?: MediaAttachment;

    @OneToOne(() => MediaAttachment, {cascade: true, onDelete: "SET NULL", persistence: true})
    @JoinColumn()
    preview512?: MediaAttachment;

    @OneToOne(() => MediaAttachment, {cascade: true, onDelete: "SET NULL", persistence: true})
    @JoinColumn()
    preview1024?: MediaAttachment;
}
