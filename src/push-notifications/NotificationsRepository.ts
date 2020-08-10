import {Between, EntityRepository, In, LessThan, MoreThan, Repository} from "typeorm";
import {Notification} from "./entities";
import {User} from "../users/entities";
import {calculateOffset, PaginationRequest} from "../utils/pagination";

@EntityRepository(Notification)
export class NotificationsRepository extends Repository<Notification> {
    public findById(id: string): Promise<Notification | null> {
        return this.findOne({
            where: {
                id
            }
        });
    }

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

    public findByReceiver(receiver: User, paginationRequest: PaginationRequest): Promise<Notification[]> {
        return this.find({
            where: {
                receiver
            },
            order: {
                createdAt: "DESC",
                read: 'ASC'
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize
        });
    }

    public findByReceiverAndCreatedAtBefore(receiver: User, createdAt: Date, paginationRequest: PaginationRequest): Promise<Notification[]> {
        return this.find({
            where: {
                receiver,
                createdAt: LessThan(createdAt)
            },
            order: {
                createdAt: "DESC",
                read:'ASC'
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize
        });
    }

    public findByReceiverAndCreatedAtAfter(receiver: User, createdAt: Date, paginationRequest: PaginationRequest): Promise<Notification[]> {
        return this.find({
            where: {
                receiver,
                createdAt: MoreThan(createdAt)
            },
            order: {
                createdAt: "DESC",
                read:'ASC'
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize
        });
    }

    public findByReceiverAndCreatedAtBetween(receiver: User,
                                             createdAtBefore: Date,
                                             createdAtAfter: Date,
                                             paginationRequest: PaginationRequest
    ): Promise<Notification[]> {
        return this.find({
            where: {
                receiver,
                createdAt: Between(createdAtBefore, createdAtAfter)
            },
            order: {
                createdAt: "DESC",
                read:'ASC'
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize
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
