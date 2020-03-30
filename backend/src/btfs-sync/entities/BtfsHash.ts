import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity()
export class BtfsHash {
    @PrimaryColumn()
    id: string;

    @Column()
    btfsCid: string;

    @Column()
    synced: boolean;

    @Column()
    createdAt: Date;
}
