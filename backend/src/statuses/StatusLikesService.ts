import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import uuid from "uuid/v4";
import {StatusLike} from "./entities";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {StatusesRepository} from "./StatusesRepository";
import {User} from "../users/entities";
import {StatusResponse} from "./types/response";
import {UserStatisticsRepository} from "../users";
import {StatusesMapper} from "./StatusesMapper";

@Injectable()
export class StatusLikesService {
    constructor(private readonly statusLikesRepository: StatusLikesRepository,
                private readonly statusRepository: StatusesRepository,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly statusesMapper: StatusesMapper) {
    }

    public async createStatusLike(statusId: string, currentUser: User): Promise<StatusResponse> {
        const status = await this.statusRepository.findById(statusId);

        if (!status) {
            throw new HttpException(
                `Could not find status with id ${statusId}`,
                HttpStatus.NOT_FOUND
            );
        }

        if (await this.statusLikesRepository.existByStatusAndUser(status, currentUser)) {
            throw new HttpException(
                "Current user has already liked this status",
                HttpStatus.FORBIDDEN
            );
        }

        const statusLike: StatusLike = {
            id: uuid(),
            status,
            user: currentUser,
            createdAt: new Date()
        };

        await this.statusLikesRepository.save(statusLike);

        const userStatistics = await this.userStatisticsRepository.findByUser(status.author);
        const favouritesCount = await this.statusLikesRepository.countByStatus(status);

        return this.statusesMapper.toStatusResponse(
            status,
            favouritesCount,
            true,
            userStatistics
        );
    }

    public async deleteStatusLike(statusId: string, currentUser: User): Promise<StatusResponse> {
        const status = await this.statusRepository.findById(statusId);

        if (!status) {
            throw new HttpException(
                `Could not find status with id ${statusId}`,
                HttpStatus.NOT_FOUND
            );
        }

        const statusLike = await this.statusLikesRepository.findByStatusAndUser(status, currentUser);

        if (!statusLike) {
            throw new HttpException(
                "Statuses which have not been liked by current user can't be unliked",
                HttpStatus.FORBIDDEN
            );
        }

        await this.statusLikesRepository.remove(statusLike);

        const userStatistics = await this.userStatisticsRepository.findByUser(status.author);
        const favouritesCount = await this.statusLikesRepository.countByStatus(status);

        return this.statusesMapper.toStatusResponse(
            status,
            favouritesCount,
            false,
            userStatistics
        );
    }
}
