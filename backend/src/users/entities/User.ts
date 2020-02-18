import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryColumn()
    id: string;

    @Column()
    ethereumAddress: string;

    @Column()
    privateKey: string;

    @Column({nullable: true})
    displayedName: string;

    @Column()
    createdAt: Date;

    @Column()
    remote: boolean;

    @Column({nullable: true})
    avatarUri?: string
}
