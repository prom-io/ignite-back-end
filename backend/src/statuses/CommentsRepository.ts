import {EntityRepository, Repository} from "typeorm";
import {Comment, Status} from "./entities";
import {calculateOffset, PaginationRequest} from "../utils/pagination";

@EntityRepository(Comment)
export class CommentsRepository extends Repository<Comment>{

    public findByStatus(status: Status, paginationRequest: PaginationRequest): Promise<Comment[]> {
        return this.find({
            where: {
                status
            },
            order: {
                createdAt: "ASC"
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize
        })
    }

    public countByStatus(status: Status): Promise<number> {
        return this.count({
            where: {
                status
            }
        })
    }
}
