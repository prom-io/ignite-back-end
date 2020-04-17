import {Between, EntityRepository, In, LessThan, MoreThan, Repository} from "typeorm";
import {Comment, Status} from "./entities";
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
            relations: ["repostedStatus", "repostedComment"]
        });
    }

    public async findById(id: string): Promise<Status | undefined> {
        return this.findOne({
            where: {
                id
            },
            relations: ["repostedStatus", "repostedComment"]
        })
    }

    public async findAllBy(paginationRequest: PaginationRequest): Promise<Status[]> {
        return this.find({
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize,
            order: {
                createdAt: "DESC"
            },
            relations: ["repostedStatus", "repostedComment"]
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
            relations: ["repostedStatus", "repostedComment"]
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
            relations: ["repostedStatus", "repostedComment"]
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
            relations: ["repostedStatus", "repostedComment"]
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
            relations: ["repostedStatus", "repostedComment"]
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
            relations: ["repostedStatus", "repostedComment"]
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
            relations: ["repostedStatus", "repostedComment"]
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
            relations: ["repostedStatus", "repostedComment"]
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
            relations: ["repostedStatus", "repostedComment"]
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
            relations: ["repostedStatus", "repostedComment"]
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
            relations: ["repostedStatus", "repostedComment"]
        })
    }

    public countByRepostedStatus(repostedStatus: Status): Promise<number> {
        return this.count({
            where: {
                repostedStatus
            }
        })
    }

    public findAncestorsOfStatus(status: Status): Promise<Status[]> {
        const treeRepository = this.manager.getTreeRepository<Status>(Status);
        return treeRepository.findAncestors(status);
    }

    public countByRepostedComment(repostedComment: Comment): Promise<number> {
        return this.count({
            where: {
                repostedComment
            }
        })
    }
}
