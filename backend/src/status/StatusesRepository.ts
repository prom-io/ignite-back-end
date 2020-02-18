import {EntityRepository, Repository} from "typeorm";
import {Status} from "./entities";
import {User} from "../users/entities";
import {calculateOffset, PaginationRequest} from "../utils/pagination";

@EntityRepository(Status)
export class StatusesRepository extends Repository<Status> {
    public async findByAuthor(author: User, paginationRequest: PaginationRequest): Promise<Status[]> {
        return await this.find({
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            where: {
                author
            },
            order: {
                createdAt: "DESC"
            }
        });
    }
}
