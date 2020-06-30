import {EntityRepository, LessThan, MoreThan, Repository} from "typeorm";
import {Status, StatusLike} from "./entities";
import {calculateOffset, PaginationRequest} from "../utils/pagination";
import {User} from "../users/entities";

@EntityRepository(StatusLike)
export class StatusLikesRepository extends Repository<StatusLike> {

    public findById(id: string): Promise<StatusLike | undefined> {
        return this.findOne({
            where: {
                id
            }
        })
    }

    public findByStatus(status: Status, paginationRequest: PaginationRequest): Promise<StatusLike[]> {
        return this.find({
            where: {
                status,
                reverted: false
            },
            take: paginationRequest.pageSize,
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize)
        })
    }

    public async countByStatus(status: Status): Promise<number> {
        return this.count({
            where: {
                status,
                reverted: false
            }
        })
    }

    public async existByStatusAndUserNotReverted(status: Status, user: User): Promise<boolean> {
        return (await this.count({
            where: {
                status,
                user,
                reverted: false
            }
        })) !== 0
    }

    public async findByStatusAndUserNotReverted(status: Status, user: User): Promise<StatusLike | undefined> {
        return await this.findOne({
            where: {
                status,
                user,
                reverted: false
            }
        })
    }

    public async existsById(id: string): Promise<boolean> {
        return (await this.count({
            where: {
                id
            }
        })) !== 0
    }

    public async countByCreatedAtAfter(createdAtAfter: Date): Promise<number> {
        return this.count({
            where: {
                createdAt: MoreThan(createdAtAfter)
            }
        })
    }

    public async countByStatusAndCreatedAtAfterNotReverted(status: Status, createdAtAfter: Date): Promise<number> {
        return this.count({
            where: {
                status,
                createdAt: MoreThan(createdAtAfter),
                reverted: false
            }
        });
    }

    public async countByStatusAndCreatedAtBeforeNotReverted(status: Status, createdAtBefore: Date): Promise<number> {
        return this.count({
            where: {
                status,
                createdAt: LessThan(createdAtBefore),
                reverted: false
            }
        });
    }
}
