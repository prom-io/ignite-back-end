import {Between, EntityRepository, In, LessThan, MoreThan, Repository} from "typeorm";
import {Status, StatusAdditionalInfo, StatusLike, StatusReferenceType} from "./entities";
import {User, UserStatistics} from "../users/entities";
import {calculateOffset, PaginationRequest} from "../utils/pagination";
import {from} from "rxjs";
import {UserSubscription} from "../user-subscriptions/entities";

@EntityRepository(Status)
export class StatusesRepository extends Repository<Status> {
    public async findByAuthor(author: User, paginationRequest: PaginationRequest): Promise<Status[]> {
        return await this.find({
            where: {
                author
            },
            order: {
                createdAt: "DESC"
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            relations: ["referredStatus"]
        });
    }

    public async findById(id: string): Promise<Status | undefined> {
        return this.findOne({
            where: {
                id
            },
            relations: ["referredStatus"]
        })
    }

    public async findAllBy(paginationRequest: PaginationRequest): Promise<Status[]> {
        return this.find({
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            order: {
                createdAt: "DESC"
            },
            relations: ["referredStatus"]
        })
    }

    public async findByAuthorAndCreatedAtBefore(author: User, createdAt: Date, paginationRequest: PaginationRequest): Promise<Status[]> {
        return this.find({
            where: {
                author,
                createdAt: LessThan(createdAt)
            },
            order: {
                createdAt: "DESC"
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            relations: ["referredStatus"]
        })
    }

    public async findByAuthorAndCreatedAtAfter(author: User, createdAt: Date, paginationRequest: PaginationRequest): Promise<Status[]> {
        return this.find({
            where: {
                author,
                createdAt: MoreThan(createdAt)
            },
            order: {
                createdAt: "DESC"
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            relations: ["referredStatus"]
        })
    }

    public async findByAuthorAndCreatedAtBetween(
        author: User,
        createdAtBefore: Date,
        createdAtAfter: Date,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        return this.find({
            where: {
                author,
                createdAt: Between(createdAtBefore, createdAtAfter)
            },
            order: {
                createdAt: "DESC"
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            relations: ["referredStatus"]
        })
    }

    public findByAuthorIn(authors: User[], paginationRequest: PaginationRequest): Promise<Status[]> {
        return this.find({
            where: {
                author: {
                    id: In(authors.map(author => author.id))
                },
            },
            order: {
                createdAt: "DESC"
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            relations: ["referredStatus"]
        })
    }

    public findByAuthorInAndCreatedAfter(authors: User[], createdAt: Date, paginationRequest: PaginationRequest): Promise<Status[]> {
        return this.find({
            where: {
                author: {
                    id: In(authors.map(author => author.id))
                },
                createdAt: MoreThan(createdAt)
            },
            order: {
                createdAt: "DESC"
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            relations: ["referredStatus"]
        })
    }

    public findByAuthorInAndCreatedAtBefore(authors: User[], createdAt: Date, paginationRequest: PaginationRequest): Promise<Status[]> {
        return this.find({
            where: {
                author: {
                    id: In(authors.map(author => author.id))
                },
                createdAt: LessThan(createdAt)
            },
            order: {
                createdAt: "DESC"
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            relations: ["referredStatus"]
        })
    }

    public findByAuthorInAndCreatedAtBetween(
        authors: User[],
        createdAtBefore: Date,
        createdAtAfter: Date,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        return this.find({
            where: {
                author: {
                    id: In(authors.map(author => author.id))
                },
                createdAt: Between(createdAtAfter, createdAtBefore)
            },
            order: {
                createdAt: "DESC"
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            relations: ["referredStatus"]
        })
    }

    public findByCreatedAtBefore(createdAtBefore: Date, paginationRequest: PaginationRequest): Promise<Status[]> {
        return this.find({
            where: {
                createdAt: LessThan(createdAtBefore)
            },
            order: {
                createdAt: "DESC"
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            relations: ["referredStatus"]
        })
    }

    public findByCreatedAtAfter(createdAtAfter: Date, paginationRequest: PaginationRequest): Promise<Status[]> {
        return this.find({
            where: {
                createdAt: MoreThan(createdAtAfter)
            },
            order: {
                createdAt: "DESC"
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            relations: ["referredStatus"]
        })
    }

    public findByCreatedAtBetween(createdAtBefore: Date, createdAtAfter: Date, paginationRequest: PaginationRequest): Promise<Status[]> {
        return this.find({
            where: {
                createdAt: Between(createdAtAfter, createdAtBefore)
            },
            order: {
                createdAt: "DESC"
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            relations: ["referredStatus"]
        })
    }

    public findByReferredStatusAndStatusReferenceType(referredStatus: Status,
                                                      statusReferenceType: StatusReferenceType,
                                                      paginationRequest: PaginationRequest,
                                                      sortingDirection: "ASC" | "DESC"
    ): Promise<Status[]> {
        return this.find({
            where: {
                referredStatus,
                statusReferenceType
            },
            order: {
                createdAt: sortingDirection
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            relations: ["referredStatus"]
        })
    }

    public findByReferredStatusAndStatusReferenceTypeAndCreatedAtBefore(
        referredStatus: Status,
        statusReferenceType: StatusReferenceType,
        createdAtBefore: Date,
        paginationRequest: PaginationRequest,
        sortingDirection: "ASC" | "DESC"
    ): Promise<Status[]> {
        return this.find({
            where: {
                referredStatus,
                statusReferenceType,
                createdAt: LessThan(createdAtBefore)
            },
            order: {
                createdAt: sortingDirection
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            relations: ["referredStatus"]
        })
    }

    public findByReferredStatusAndStatusReferenceTypeAndCreatedAtAfter(
        referredStatus: Status,
        statusReferenceType: StatusReferenceType,
        createdAtAfter: Date,
        paginationRequest: PaginationRequest,
        sortingDirection: "ASC" | "DESC"
    ): Promise<Status[]> {
        return this.find({
            where: {
                referredStatus,
                statusReferenceType,
                createdAt: MoreThan(createdAtAfter)
            },
            order: {
                createdAt: sortingDirection
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            relations: ["referredStatus"]
        })
    }

    public findByReferredStatusAndStatusReferenceTypeAndCreatedAtBetween(
        referredStatus: Status,
        statusReferenceType: StatusReferenceType,
        createdAtBefore: Date,
        createdAtAfter: Date,
        paginationRequest: PaginationRequest,
        sortingDirection: "ASC" | "DESC"
    ): Promise<Status[]> {
        return this.find({
            where: {
                referredStatus,
                statusReferenceType,
                createdAt: Between(createdAtBefore, createdAtAfter)
            },
            order: {
                createdAt: sortingDirection
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            relations: ["referredStatus"]
        })
    }

    public countReposts(repostedStatus: Status): Promise<number> {
        return this.countByReferredStatusAndStatusReferenceType(repostedStatus, StatusReferenceType.REPOST);
    }

    public countComments(commentedStatus: Status): Promise<number> {
        return this.countByReferredStatusAndStatusReferenceType(commentedStatus, StatusReferenceType.COMMENT);
    }

    public countByReferredStatusAndStatusReferenceType(referredStatus: Status, statusReferenceType: StatusReferenceType): Promise<number> {
        return this.count({
            where: {
                referredStatus,
                statusReferenceType
            }
        })
    }

    public async existByReferredStatusAndReferenceTypeAndAuthor(
        referredStatus: Status,
        statusReferenceType: StatusReferenceType,
        author: User
    ): Promise<boolean> {
        return (await this.count({
            where: {
                referredStatus,
                statusReferenceType,
                author
            }
        })) !== 0
    }

    public countByRepostedStatus(repostedStatus: Status): Promise<number> {
        return this.count({
            where: {
                referredStatus: repostedStatus,
                statusReferenceType: StatusReferenceType.REPOST
            }
        })
    }

    public findAncestorsOfStatus(status: Status): Promise<Status[]> {
        const treeRepository = this.manager.getTreeRepository<Status>(Status);
        return treeRepository.findAncestors(status);
    }

    public async findStatusInfoByStatusIdIn(ids: string[], currentUser?: User): Promise<StatusAdditionalInfo[]> {
        let queryBuilder = this.createQueryBuilder("status");

        queryBuilder = queryBuilder
            .select("status.id")
            .where({
                id: In(ids)
            })
            .innerJoinAndSelect(
                UserStatistics,
                "author_statistics",
                `author_statistics."userId" = status."authorId"`
            )
            .addSelect(
                subquery => subquery
                    .select("count(id)", "likes_count")
                    .from(StatusLike, "status_like")
                    .where(`status_like."statusId" = status.id`)
            )
            .addSelect(
                subquery => subquery
                    .select("count (id)", "comments_count")
                    .from(Status, "compared_status")
                    .where(`"referredStatusId" = status.id`)
                    .andWhere(`"statusReferenceType" = 'COMMENT'`)
            )
            .addSelect(
                subquery => subquery
                    .select("count (id)", "reposts_count")
                    .from(Status, "compared_status")
                    .where(`"referredStatusId" = status.id`)
                    .andWhere(`"statusReferenceType" = 'REPOST'`)
            );

        if (currentUser) {
            queryBuilder = queryBuilder
                .addSelect(
                    subquery => subquery
                        .select("count (id)", "current_user_likes_count")
                        .from(StatusLike, "status_like")
                        .where(`status_like."userId" = '${currentUser.id}'`)
                        .andWhere(`status_like."statusId" = status.id`)
            )
                .addSelect(
                    subquery => subquery
                        .select("count (id)", "current_user_comments_count")
                        .from(Status, "compared_status")
                        .where(`"authorId" = '${currentUser.id}'`)
                        .andWhere(`"referredStatusId" = status.id`)
                        .andWhere(`"statusReferenceType" = 'COMMENT'`)
                )
                .addSelect(
                    subquery => subquery
                        .select("count (id)", "current_user_reposts_count")
                        .from(Status, "compared_status")
                        .where(`"authorId" = '${currentUser.id}'`)
                        .andWhere(`"referredStatusId" = status.id`)
                        .andWhere(`"statusReferenceType" = 'REPOST'`)
                )
                .addSelect(
                    subquery => subquery
                        .select("count (id)", "subscriptions_of_current_user_to_status_author_count")
                        .from(UserSubscription, "user_subscription")
                        .where(`user_subscription."subscribedToId" = status."authorId"`)
                        .andWhere(`user_subscription."subscribedUserId" = '${currentUser.id}'`)
                        .andWhere("reverted = false")
                )
                .addSelect(
                    subquery => subquery
                        .select("count (id)", "subscriptions_of_status_author_to_current_user_count")
                        .from(UserSubscription, "user_subscription")
                        .where(`user_subscription."subscribedToId" = '${currentUser.id}'`)
                        .andWhere(`user_subscription."subscribedUserId" = status."authorId"`)
                        .andWhere("reverted = false")
                )
        }

        const rawResults: any[] = await queryBuilder.getRawMany();

        return rawResults.map(raw => ({
            id: raw.status_id as string,
            commentsCount: Number(raw.comments_count),
            likesCount: Number(raw.likes_count),
            repostsCount: Number(raw.reposts_count),
            currentUserFollowsAuthor: currentUser && Boolean(Number(raw.subscriptions_of_current_user_to_status_author_count)),
            currentUserFollowedByAuthor: currentUser && Boolean(Number(raw.subscriptions_of_status_author_to_current_user_count)),
            likedByCurrentUser: currentUser && Boolean(Number(raw.current_user_likes_count)),
            commentedByCurrentUser: currentUser && Boolean(Number(raw.current_user_comments_count)),
            repostedByCurrentUser: currentUser && Boolean(Number(raw.current_user_reposts_count)),
            statusAuthorStatistics: {
                id: raw.author_statistics_id,
                followersCount: raw.author_statisctics_followersCount,
                followsCount: raw.author_statusctics_followsCount,
                statusesCount: raw.author_statisctics_statusesCount
            }
        }))
    }
}
