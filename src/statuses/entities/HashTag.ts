import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity()
export class HashTag {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    createdAt: Date;
}
