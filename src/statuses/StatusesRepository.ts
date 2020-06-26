import {Between, EntityRepository, In, LessThan, MoreThan, Repository, SelectQueryBuilder} from "typeorm";
import {subDays} from "date-fns";
import {HashTag, Status, StatusLike, StatusReferenceType} from "./entities";
import {Language, User} from "../users/entities";
import {calculateOffset, PaginationRequest} from "../utils/pagination";

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

    public findAllByIds(ids: string[]): Promise<Status[]> {
        return this.find({
            where: {
                id: In(ids),
            },
            order: {
                createdAt: "DESC",
            },
            relations: ["referredStatus"]
        })
    }

    public async findByHashTag(hashTag: HashTag, paginationRequest: PaginationRequest): Promise<Status[]> {
        return this.createStatusQueryBuilder()
            .where(`"status_hashTag"."hashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
            .orderBy(`status."createdAt"`, "DESC")
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany()

    }

    public async findByHashTagAndCreatedAtBefore(
        hashTag: HashTag,
        createdAtBefore: Date,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        return this.createStatusQueryBuilder()
            .where(`"status_hashTag"."hashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
            .andWhere(`status."createdAt" < :createdAt`, {createdAt: createdAtBefore})
            .orderBy(`status."createdAt"`, "DESC")
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany();
    }

    public async findByHashTagAndCreatedAtAfter(
        hashTag: HashTag,
        createdAtAfter: Date,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        return this.createStatusQueryBuilder()
            .where(`"status_hashTag"."hashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
            .andWhere(`status."createdAt" > :createdAt`, {createdAt: createdAtAfter})
            .orderBy(`status."createdAt"`, "DESC")
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany();
    }

    public async findByHashTagAndCreatedAtBetween(
        hashTag: HashTag,
        createdAtBefore: Date,
        createdAtAfter: Date,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        return this.createStatusQueryBuilder().where(`"status_hashTag"."hashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
            .andWhere(`status."createdAt" between(:createdAtBefore, :createdAtAfter)`, {createdAtBefore, createdAtAfter})
            .orderBy(`status."createdAt"`, "DESC")
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany();
    }

    public async findByHashTagOrderByNumberOfLikesForLastWeek(
        hashTag: HashTag,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        const weekAgo = subDays(new Date(), 7);

        return this.createStatusQueryBuilder()
            .addSelect(
                subquery => subquery
                    .select("count(id)", "likes_count")
                    .from(StatusLike, "status_like")
                    .where(`status_like."statusId" = status.id`)
                    .andWhere(`status_like."createdAt" > :weekAgo`, {weekAgo})
                    .andWhere("status_like.reverted = false")
            )
            .where(`"status_hashTag"."hashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
            .orderBy({
                "likes_count": "DESC",
                "status.\"createdAt\"": "DESC"
            })
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany();
    }

    public async findByHashTagAndCreatedAtBetweenOrderByNumberOfLikesForLastWeek(
        hashTag: HashTag,
        createdAtBefore: Date,
        createdAtAfter: Date,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        const weekAgo = subDays(new Date(), 7)

        return this.createStatusQueryBuilder()
            .addSelect(
                subquery => subquery
                    .select("count(id)", "likes_count")
                    .from(StatusLike, "status_like")
                    .where(`status_like."statusId" = status.id`)
                    .andWhere(`status_like."createdAt" > :weekAgo`, {weekAgo})
                    .andWhere("status_like.reverted = false")
            )
            .where(`"status_hashTag"."hashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
            .andWhere(`status."createdAt" between(:createdAtBefore, createdAtAfter)`, {createdAtBefore, createdAtAfter})
            .orderBy({
                "likes_count": "DESC",
                "status.\"createdAt\"": "DESC"
            })
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany();
    }

    public async findByHashTagAndCreatedAtBeforeOrderByNumberOfLikesForLastWeek(
        hashTag: HashTag,
        createdAtBefore: Date,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        const weekAgo = subDays(new Date(), 7);

        return this.createStatusQueryBuilder()
            .addSelect(
                subquery => subquery
                    .select("count(id)")
                    .from(StatusLike, "status_like")
                    .where(`status_like."statusId" = status.id`)
                    .andWhere(`status_like."createdAt" > :weekAgo`, {weekAgo})
                    .andWhere("status_like.reverted = false")
            )
            .where(`"status_hashTag"."hashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
            .andWhere(`status."createdAt" < :createdAtBefore`, {createdAtBefore})
            .orderBy({
                "likes_count": "DESC",
                "status.\"createdAt\"": "DESC"
            })
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany();
    }

    public async findByHashTagAndCreatedAtAfterOrderByNumberOfLikesForLastWeek(
        hashTag: HashTag,
        createdAtAfter: Date,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        const weekAgo = subDays(new Date(), 7);

        return this.createStatusQueryBuilder()
            .addSelect(
                subquery => subquery.
                select("count(id)", "likes_count")
                    .from(StatusLike, "status_like")
                    .where(`status_like."statusId" = status.id`)
                    .andWhere(`statusLike."createdAt" > :weekAgo`, {weekAgo})
                    .andWhere("status_like.reverted = false")
            )
            .where(`"status_hashTag"."hashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
            .andWhere(`status."createdAt" > :createdAtAfter`, {createdAtAfter})
            .orderBy({
                "likes_count": "DESC",
                "status.\"createdAt\"": "DESC"
            })
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany();
    }

    public async findContainingHashTagsByLanguage(
        language: Language,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        return this.createStatusQueryBuilder()
            .where(`"status_hashTag"."hashTagId" is not null`)
            .andWhere(`"status_hashTag".language = :language`, {language})
            .orderBy(`status."createdAt"`, "DESC")
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany();
    }

    public async findContainingHashTagsByLanguageAndCreatedAtBefore(
        language: Language,
        createdAtBefore: Date,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        return this.createStatusQueryBuilder()
            .where(`"status_hashTag"."hashTagId" is not null`)
            .andWhere(`"status_hashTag".language = :language`, {language})
            .andWhere(`status."createdAt" < :createdAtBefore`, {createdAtBefore})
            .orderBy(`status."createdAt"`, "DESC")
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany();
    }

    public async findContainingHashTagsByLanguageAndCreatedAtAfter(
        language: Language,
        createdAtAfter: Date,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        return this.createStatusQueryBuilder()
            .where(`"status_hashTag"."hashTagId" is not null`)
            .andWhere(`"status_hashTag".language = :language`, {language})
            .andWhere(`status."createdAt" > :createdAtAfter`, {createdAtAfter})
            .orderBy(`status."createdAt"`, "DESC")
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany();
    }

    public async findContainingHashTagsByLanguageAndCreatedAtBetween(
        language: Language,
        createdAtBefore: Date,
        createdAtAfter: Date,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        return this.createStatusQueryBuilder()
            .where(`"status_hashTag"."hashTagId" is not null`)
            .andWhere(`"status_hashTag".language = :language`, {language})
            .andWhere(`status."createdAt" between(:createdAtBefore, :createdAtAfter)`, {createdAtBefore, createdAtAfter})
            .orderBy(`status."createdAt"`, "DESC")
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany();
    }

    public async findContainingHashTagsByLanguageOrderByNumberOfLikesForLastWeek(
        language: Language,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        const weekAgo = subDays(new Date(), 7);

        return this.createStatusQueryBuilder()
            .addSelect(
                subquery => subquery
                    .select("count(id)", "last_week_likes_count")
                    .from(StatusLike, "status_like")
                    .where(`status_like."statusId" = status.id`)
                    .andWhere("status_like.reverted = false")
                    .andWhere(`status_like."createdAt" > :weekAgo`, {weekAgo})
            )
            .where(`"status_hashTag"."hashTagId" is not null`)
            .andWhere(`"status_hashTag".language = :language`, {language})
            .orderBy({
                "last_week_likes_count": "DESC",
                "status.\"createdAt\"": "DESC"
            })
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany();
    }

    public async findContainingHashTagsByLanguageAndCreatedAtBeforeOrderByNumberOfLikesForLastWeek(
        language: Language,
        createdAtBefore: Date,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        const weekAgo = subDays(new Date(), 7);

        return this.createStatusQueryBuilder()
            .addSelect(
                subquery => subquery
                    .select("count(id)", "last_week_likes_count")
                    .from(StatusLike, "status_like")
                    .where(`status_like."statusId" = status.id`)
                    .andWhere("status_like.reverted = false")
                    .andWhere(`status_like."createdAt" > :weekAgo`, {weekAgo})
            )
            .where(`"status_hashTag"."hashTagId" is not null`)
            .andWhere(`"status_hashTag".language = :language`, {language})
            .andWhere(`status."createdAt" < :createdAtBefore`, {createdAtBefore})
            .orderBy({
                "last_week_likes_count": "DESC",
                "status.\"createdAt\"": "DESC"
            })
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany();
    }

    public async findContainingHashTagsByLanguageAndCreatedAtAfterOrderByNumberOfLikesForLastWeek(
        language: Language,
        createdAtAfter: Date,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        const weekAgo = subDays(new Date(), 7);

        return this.createStatusQueryBuilder()
            .addSelect(
                subquery => subquery.
                select("count(id)", "last_week_likes_count")
                    .from(StatusLike, "status_like")
                    .where(`status_like."statusId" = status.id`)
                    .andWhere("status_like.reverted = false")
                    .andWhere(`status_like."createdAt" > :weekAgo`, {weekAgo})
            )
            .where(`"status_hashTag"."hashTagId" is not null`)
            .andWhere(`"status_hashTag".language = :language`, {language})
            .andWhere(`status."createdAt" > :createdAtAfter`, {createdAtAfter})
            .orderBy({
                "last_week_likes_count": "DESC",
                "status.\"createdAt\"": "DESC"
            })
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany();
    }

    public async findContainingHashTagsByLanguageAndCreatedAtBetweenOrderByNumberOfLikesForLastWeek(
        language: Language,
        createdAtBefore: Date,
        createdAtAfter: Date,
        paginationRequest: PaginationRequest
    ): Promise<Status[]> {
        const weekAgo = subDays(new Date(), 7);

        return this.createStatusQueryBuilder()
            .addSelect(
                subquery => subquery
                    .select("count(id)", "last_week_likes_count")
                    .from(StatusLike, "status_like")
                    .where(`status_like."statusId" = status.id`)
                    .andWhere("status_like.reverted = false")
                    .andWhere(`status_like."createdAt" > :weekAgo`, {weekAgo})
            )
            .where(`"status_hashTag"."hashTagId" is not null`)
            .andWhere(`"status_hashTag".language = :language`, {language})
            .andWhere(`status."createdAt" between(:createdAtBefore, :createdAtAfter)`, {createdAtBefore, createdAtAfter})
            .orderBy({
                "last_week_likes_count": "DESC",
                "status.\"createdAt\"": "DESC"
            })
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany();
    }

    private createStatusQueryBuilder(): SelectQueryBuilder<Status> {
        return this.createQueryBuilder("status")
            .leftJoinAndSelect("status.hashTags", "hashTag")
            .leftJoinAndSelect("status.author", "author")
            .leftJoinAndSelect("author.avatar", "authorAvatar")
            .leftJoinAndSelect("status.mediaAttachments", "mediaAttachments")
            .leftJoinAndSelect("status.referredStatus", "referredStatus")
            .leftJoinAndSelect("referredStatus.mediaAttachments", "referredStatusMediaAttachments")
            .leftJoinAndSelect("referredStatus.author", "referredStatusAuthor")
            .leftJoinAndSelect("referredStatusAuthor.avatar", "referredStatusAuthorAvatar")
            .leftJoinAndSelect("referredStatus.hashTags", "referredStatusHashTags")
    }

    public countByHashTag(hashTag: HashTag): Promise<number> {
        return this.createQueryBuilder("status")
            .leftJoinAndSelect("status.hashTags", "hashTag")
            .where(`"hashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
            .getCount()
    }
}
