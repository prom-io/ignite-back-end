import {EntityRepository, In, Repository} from "typeorm";
import {Notification} from "./entities";
import {User} from "../users/entities";

@EntityRepository(Notification)
export class NotificationsRepository extends Repository<Notification> {
    public findAllByReceiver(receiver: User): Promise<Notification[]> {
        return this.find({
            where: {
                receiver
            },
            order: {
                createdAt: "DESC"
            }
        })
    }

    public findNotReadByReceiver(receiver: User): Promise<Notification[]> {
        return this.find({
            where: {
                receiver,
                read: false
            },
            order: {
                createdAt: "DESC"
            }
        });
    }

    public findAllById(ids: string[]): Promise<Notification[]> {
        return this.find({
            where: {
                id: In(ids)
            }
        });
    }
}
