import {Entity, PrimaryColumn, Column} from "typeorm";
import {Language} from "./Language";

@Entity()
export class UserPreferences {
    @PrimaryColumn()
    id: string;

    @Column({nullable: true, type: "varchar", enum: Language})
    language: Language;
}
