import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {NotificationType} from "./NotificationType";
import {User} from "../../users/entities";

@Entity()
export class Notification {
    @PrimaryColumn()
    id: string;

    @Column({type: "varchar", enum: NotificationType})
    type: NotificationType;

    @Column()
    notificationObjectId: string;

    @Column()
    read: boolean;

    @ManyToOne(() => User, {eager: true})
    receiver: User;

    @Column()
    createdAt: Date;
}
