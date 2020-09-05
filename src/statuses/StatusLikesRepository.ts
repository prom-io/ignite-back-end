import { MEMEZATOR_HASHTAG } from "./../common/constants";
import { StatusLike } from "./entities/StatusLike";
import {EntityRepository, LessThan, MoreThan, Repository} from "typeorm";
import {Status} from "./entities";
import {calculateOffset, PaginationRequest} from "../utils/pagination";
import {User} from "../users/entities";
import { getCurrentMemezatorContestStartTime } from "../memezator/utils";

@EntityRepository(StatusLike)
export class StatusLikesRepository extends Repository<StatusLike> {

    public findById(id: string): Promise<StatusLike | undefined> {
        return this.findOne({
            where: {
                id
            }
        })
    }

    public async getAmountOfLikedMemesCreatedTodayByUser(user: User): Promise<number> {
        const currentMemezatorContestStartTime = getCurrentMemezatorContestStartTime()

        return this.count({
            join: { alias: "statuslikes", leftJoin: { status: "statuslikes.status", hashTag: "status.hashTags" } },
            where: qb => {
                qb.where({ 
                    createdAt: MoreThan(currentMemezatorContestStartTime),
                    user: user.id,
                    reverted: false
                })
                .andWhere("\"hashTag\".\"name\" = :name", { name: MEMEZATOR_HASHTAG });
            }
        })
    }

    public findAllByCreatedAtAfter(createdAtAfter: Date): Promise<StatusLike[]> {
        return this.find({
            where: {
                createdAt: MoreThan(createdAtAfter)
            }
        })
    }

    public findByStatus(status: Status, paginationRequest?: PaginationRequest): Promise<StatusLike[]> {
        return this.find({
            where: {
                status,
                reverted: false
            },
            take: paginationRequest && paginationRequest.pageSize,
            skip: paginationRequest && calculateOffset(paginationRequest.page, paginationRequest.pageSize)
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
