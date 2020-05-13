import {Entity, PrimaryColumn, Column, OneToOne} from "typeorm";
import {Language} from "./Language";
import {User} from "./User";

@Entity()
export class UserPreferences {
    @PrimaryColumn()
    id: string;

    @Column({nullable: true, type: "varchar", enum: Language})
    language: Language;

    @OneToOne(() => User, user => user.preferences)
    user: User;
}
