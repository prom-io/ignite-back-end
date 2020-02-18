import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {StatusesRepository} from "./StatusesRepository";
import {CreateStatusRequest} from "./types/request";
import {StatusResponse} from "./types/response";
import {StatusesMapper} from "./StatusesMapper";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {User} from "../users/entities";
import {UsersRepository} from "../users/UsersRepository";
import {PaginationRequest} from "../utils/pagination";
import {Status} from "./entities";

@Injectable()
export class StatusesService {
    constructor(@InjectRepository(StatusesRepository) private readonly statusesRepository: StatusesRepository,
                @InjectRepository(StatusLikesRepository) private readonly statusLikesRepository: StatusLikesRepository,
                @InjectRepository(UsersRepository) private readonly usersRepository: UsersRepository,
                private readonly statusesMapper: StatusesMapper) {
    }

    public async createStatus(createStatusRequest: CreateStatusRequest, currentUser: User): Promise<StatusResponse> {
        return this.statusesMapper.toStatusResponse(
            await this.statusesRepository.create(this.statusesMapper.fromCreateStatusRequest(createStatusRequest, currentUser)), 0
        )
    }

    public async findById(id: string): Promise<StatusResponse> {
        const status = await this.statusesRepository.findOne({where: {id}});

        if (!status) {
            throw new HttpException(`Could not find status with id ${id}`, HttpStatus.NOT_FOUND);
        }

        const likesCount = await this.statusLikesRepository.countByStatus(status);

        return this.statusesMapper.toStatusResponse(status, likesCount);
    }

    public async findByUser(ethereumAddress: string, paginationRequest: PaginationRequest): Promise<StatusResponse[]> {
        const user = await this.usersRepository.findByEthereumAddress(ethereumAddress);

        if (!user) {
            throw new HttpException(`Could not find user with address ${ethereumAddress}`, HttpStatus.NOT_FOUND);
        }

        const statuses: Status[] = await this.statusesRepository.findByAuthor(user, paginationRequest);
        const likesCountMap: {[statusId: string]: number} = {};

        for (const status of statuses) {
            likesCountMap[status.id] = await this.statusLikesRepository.countByStatus(status);
        }

        return statuses.map(status => this.statusesMapper.toStatusResponse(
            status,
            likesCountMap[status.id]
        ))
    }
}
