import {EntityRepository, Repository} from "typeorm";
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
}
