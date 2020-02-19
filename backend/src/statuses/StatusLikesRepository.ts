import {EntityRepository, Repository} from "typeorm";
import {Status, StatusLike} from "./entities";
import {calculateOffset, PaginationRequest} from "../utils/pagination";
import {User} from "../users/entities";

@EntityRepository(StatusLike)
export class StatusLikesRepository extends Repository<StatusLike> {

    public findByStatus(status: Status, paginationRequest: PaginationRequest): Promise<StatusLike[]> {
        return this.find({
            where: {
                status
            },
            take: paginationRequest.pageSize,
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize)
        })
    }

    public async countByStatus(status: Status): Promise<number> {
       return this.count({
           where: {
               status
           }
       })
    }

    public async existByStatusAndUser(status: Status, user: User): Promise<boolean> {
        return (await this.count({
            where: {
                status,
                user
            }
        })) !== 0
    }

    public async findByStatusAndUser(status: Status, user: User): Promise<StatusLike | undefined> {
        return await this.findOne({
            where: {
                status,
                user
            }
        })
    }
}
