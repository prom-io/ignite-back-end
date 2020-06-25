import {Between, EntityRepository, In, LessThan, MoreThan, Repository} from "typeorm";
import {HashTag, Status, StatusLike, StatusReferenceType} from "./entities";
import {User} from "../users/entities";
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
                id: In(ids)
            }
        })
    }

    public async findIdsByHashTag(hashTag: HashTag, paginationRequest: PaginationRequest): Promise<string[]> {
        return (await this.createQueryBuilder("status")
            .leftJoinAndSelect("status.hashTags", "hashTag")
            .where(`"hashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
            .orderBy(`status."createdAt"`, "DESC")
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany()
        )
            .map(status => status.id)
    }

    public async findByHashTag(hashTag: HashTag, paginationRequest: PaginationRequest): Promise<Status[]> {
        return this.createQueryBuilder("status")
            .leftJoinAndSelect("status.hashTags", "hashTag")
            .leftJoinAndSelect("status.author", "author")
            .leftJoinAndSelect("status.mediaAttachments", "mediaAttachment")
            .leftJoinAndSelect("status.referredStatus", "referredStatus")
            .leftJoinAndSelect("referredStatus.author", "referredStatusAuthor")
            .leftJoinAndSelect("referredStatus.mediaAttachments", "referredStatusMediaAttachment")
            .leftJoinAndSelect("referredStatus.hashTags", "referredStatusHashTags")
            .where(`"statusHashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
            .orderBy(`status."createdAt"`, "DESC")
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany();
    }

    public async findIdsByHashTagAndCreatedAtBefore(
        hashTag: HashTag,
        createdAtBefore: Date,
        paginationRequest: PaginationRequest
    ): Promise<string[]> {
        return (await this.createQueryBuilder("status")
            .leftJoinAndSelect("status.hashTags", "hashTag")
            .where(`"hashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
            .andWhere(`status."createdAt" < :createdAt`, {createdAt: createdAtBefore})
            .orderBy(`status."createdAt"`, "DESC")
            .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .limit(paginationRequest.pageSize)
            .getMany()
        )
            .map(status => status.id)
    }

    public async findIdsByHashTagAndCreatedAtAfter(
        hashTag: HashTag,
        createdAtAfter: Date,
        paginationRequest: PaginationRequest
    ): Promise<string[]> {
        return (await this.createQueryBuilder("status")
                .leftJoinAndSelect("status.hashTags", "hashTag")
                .where(`"hashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
                .andWhere(`status."createdAt" > :createdAt`, {createdAt: createdAtAfter})
                .orderBy(`status."createdAt"`, "DESC")
                .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
                .limit(paginationRequest.pageSize)
                .getMany()
        )
            .map(status => status.id)
    }

    public async findIdsByHashTagAndCreatedAtBetween(
        hashTag: HashTag,
        createdAtBefore: Date,
        createdAtAfter: Date,
        paginationRequest: PaginationRequest
    ): Promise<string[]> {
        return (await this.createQueryBuilder("status")
                .leftJoinAndSelect("status.hashTags", "hashTag")
                .where(`"hashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
                .andWhere(`status."createdAt" between(:createdAtBefore, :createdAtAfter)`, {createdAtBefore, createdAtAfter})
                .orderBy(`status."createdAt"`, "DESC")
                .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
                .limit(paginationRequest.pageSize)
                .getMany()
        )
            .map(status => status.id)
    }

    public async findIdsByHashTagAndCreatedAtBetweenOrderByNumberOfLikes(
        hashTag: HashTag,
        createdAtBefore: Date,
        createdAtAfter: Date,
        paginationRequest: PaginationRequest
    ): Promise<string[]> {
        return (await this.createQueryBuilder("status")
                .leftJoinAndSelect("status.hashTags", "hashTag")
                .addSelect(
                    subquery => subquery
                        .select("count(id)", "likes_count")
                        .from(StatusLike, "status_like")
                        .where(`status_like."status_id" = status.id`)
                        .andWhere("status_like.reverted = false")
                )
                .where(`"hashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
                .andWhere(`status."createdAt" between(:createdAtBefore, createdAtAfter)`, {createdAtBefore, createdAtAfter})
                .orderBy({
                    "likes_count": "DESC",
                    "status.\"createdAt\"": "DESC"
                })
                .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
                .limit(paginationRequest.pageSize)
                .getMany()
        )
            .map(status => status.id)
    }

    public async findIdsByHashTagAndCreatedAtAfterOrderByNumberOfLikes(
        hashTag: HashTag,
        createdAtAfter: Date,
        paginationRequest: PaginationRequest
    ): Promise<string[]> {
        return (await this.createQueryBuilder("status")
                .leftJoinAndSelect("status.hashTags", "hashTag")
                .addSelect(
                    subquery => subquery.
                        select("count(id)", "likes_count")
                        .from(StatusLike, "status_like")
                        .where(`status_like."statusId" = status.id`)
                        .andWhere("status_like.reverted = false")
                )
                .where(`"hashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
                .andWhere(`status."createdAt" > :createdAtAfter`, {createdAtAfter})
                .orderBy({
                    "likes_count": "DESC",
                    "status.\"createdAt\"": "DESC"
                })
                .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
                .limit(paginationRequest.pageSize)
                .getMany()
        )
            .map(status => status.id)
    }

    public countByHashTag(hashTag: HashTag): Promise<number> {
        return this.createQueryBuilder("status")
            .leftJoinAndSelect("status.hashTags", "hashTag")
            .where(`"hashTagId" in (:...hashTags)`, {hashTags: [hashTag.id]})
            .getCount()
    }
}
