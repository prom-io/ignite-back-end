import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
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
    constructor(private readonly statusesRepository: StatusesRepository,
                private readonly statusLikesRepository: StatusLikesRepository,
                private readonly usersRepository: UsersRepository,
                private readonly statusesMapper: StatusesMapper) {
    }

    public async createStatus(createStatusRequest: CreateStatusRequest, currentUser: User): Promise<StatusResponse> {
        let status = this.statusesMapper.fromCreateStatusRequest(createStatusRequest, currentUser);
        status = await this.statusesRepository.save(status);
        return this.statusesMapper.toStatusResponse(status, 0, false);
    }

    public async findStatusById(id: string, currentUser?: User): Promise<StatusResponse> {
        const status = await this.statusesRepository.findOne({where: {id}});

        if (!status) {
            throw new HttpException(`Could not find status with id ${id}`, HttpStatus.NOT_FOUND);
        }

        const likesCount = await this.statusLikesRepository.countByStatus(status);
        let likedByCurrentUser = false;

        if (likesCount !== 0 && currentUser) {
            likedByCurrentUser = await this.statusLikesRepository.existByStatusAndUser(status, currentUser);
        }

        return this.statusesMapper.toStatusResponse(status, likesCount, likedByCurrentUser);
    }

    public async findStatusesByUser(
        ethereumAddress: string,
        paginationRequest: PaginationRequest,
        currentUser?: User,
    ): Promise<StatusResponse[]> {
        const user = await this.usersRepository.findByEthereumAddress(ethereumAddress);

        if (!user) {
            throw new HttpException(`Could not find user with address ${ethereumAddress}`, HttpStatus.NOT_FOUND);
        }

        const statuses: Status[] = await this.statusesRepository.findByAuthor(user, paginationRequest);
        const likesMap: {[statusId: string]: {
            numberOfLikes: number,
            likedByCurrentUser: boolean
        }} = {};

        for (const status of statuses) {
            likesMap[status.id] = {
                numberOfLikes: await this.statusLikesRepository.countByStatus(status),
                likedByCurrentUser: currentUser && await this.statusLikesRepository.existByStatusAndUser(
                    status,
                    currentUser
                )
            };
        }

        return statuses.map(status => this.statusesMapper.toStatusResponse(
            status,
            likesMap[status.id].numberOfLikes,
            likesMap[status.id].likedByCurrentUser
        ))
    }
}
