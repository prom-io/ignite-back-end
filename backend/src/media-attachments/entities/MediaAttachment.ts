import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class MediaAttachment {
    @PrimaryColumn()
    id: string;

    @Column()
    mimeType: string;

    @Column()
    format: string;

    @Column()
    width?: number;

    @Column()
    height?: number;

    name: string;
}
