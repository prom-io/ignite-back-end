import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import uuid from "uuid/v4";
import {StatusLike} from "./entities";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {StatusesRepository} from "./StatusesRepository";
import {StatusesMapper} from "./StatusesMapper";
import {StatusResponse} from "./types/response";
import {User} from "../users/entities";

@Injectable()
export class StatusLikesService {
    constructor(private readonly statusLikesRepository: StatusLikesRepository,
                private readonly statusesRepository: StatusesRepository,
                private readonly statusesMapper: StatusesMapper) {
    }

    public async createStatusLike(statusId: string, currentUser: User): Promise<StatusResponse> {
        const status = await this.statusesRepository.findById(statusId);

        if (!status) {
            throw new HttpException(
                `Could not find status with id ${statusId}`,
                HttpStatus.NOT_FOUND
            );
        }

        if (await this.statusLikesRepository.existByStatusAndUserNotReverted(status, currentUser)) {
            throw new HttpException(
                "Current user has already liked this status",
                HttpStatus.FORBIDDEN
            );
        }

        const statusLike: StatusLike = {
            id: uuid(),
            status,
            user: currentUser,
            createdAt: new Date(),
            reverted: false,
            revertedAt: null
        };

        await this.statusLikesRepository.save(statusLike);

        await this.statusesRepository.update({id: status.id}, {favoritesCount: status.favoritesCount += 1});
        status.favoritesCount = status.favoritesCount += 1;
        return this.statusesMapper.toStatusResponseAsync(status, currentUser);
    }

    public async deleteStatusLike(statusId: string, currentUser: User): Promise<StatusResponse> {
        const status = await this.statusesRepository.findById(statusId);

        if (!status) {
            throw new HttpException(
                `Could not find status with id ${statusId}`,
                HttpStatus.NOT_FOUND
            );
        }

        const statusLike = await this.statusLikesRepository.findByStatusAndUserNotReverted(status, currentUser);

        if (!statusLike) {
            throw new HttpException(
                "Statuses which have not been liked by current user can't be unliked",
                HttpStatus.FORBIDDEN
            );
        }

        statusLike.reverted = true;
        statusLike.saveUnlikeToBtfs = true;
        statusLike.revertedAt = new Date();

        await this.statusLikesRepository.save(statusLike);

        await this.statusesRepository.update({id: status.id}, {favoritesCount: status.favoritesCount -= 1});
        status.favoritesCount = status.favoritesCount -= 1;
        return this.statusesMapper.toStatusResponseAsync(status, currentUser);
    }
}
