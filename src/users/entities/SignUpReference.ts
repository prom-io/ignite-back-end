import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./User";
import {ISignUpReferenceConfig} from "../types/ISignUpReferenceConfig";

@Entity()
export class SignUpReference {
    @PrimaryColumn()
    id: string;

    @Column("jsonb")
    config: ISignUpReferenceConfig;

    @Column()
    createdAt: Date;

    @Column({nullable: true})
    expiresAt?: Date;

    @Column({nullable: true})
    maxUses?: number;

    @Column()
    registeredUsersCount: number;

    @ManyToOne(() => User, {eager: true})
    createdBy: User;
}
