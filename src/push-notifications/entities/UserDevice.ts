import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "../../users/entities";

@Entity()
export class UserDevice {
    @PrimaryColumn()
    id: string;

    @ManyToOne(() => User, {eager: true})
    user: User;

    @Column()
    fcmToken: string;

    @Column()
    fcmTokenExpired?: boolean;
}
