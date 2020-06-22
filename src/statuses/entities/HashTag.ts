import {Entity, Column, PrimaryColumn, Index} from "typeorm";
import {Language} from "../../users/entities";

@Entity()
export class HashTag {
    @PrimaryColumn()
    id: string;

    @Index()
    @Column()
    name: string;

    @Column()
    createdAt: Date;

    @Index()
    @Column()
    language: Language;

    @Column()
    postsCount: number;
}
