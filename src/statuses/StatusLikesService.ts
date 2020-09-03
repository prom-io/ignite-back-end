import {HttpException, HttpStatus, Injectable, ForbiddenException} from "@nestjs/common";
import uuid from "uuid/v4";
import {StatusLike} from "./entities";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {StatusesRepository} from "./StatusesRepository";
import {StatusesMapper} from "./StatusesMapper";
import {StatusResponse} from "./types/response";
import {User} from "../users/entities";
import { MEMEZATOR_HASHTAG } from "../common/constants";

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

        const isMeme = status.hashTags.some(hashTag => hashTag.name === MEMEZATOR_HASHTAG)
        const lastMidnightInCET = new Date()
        lastMidnightInCET.setHours(2, 0, 0, 0)

        if (isMeme && status.createdAt.valueOf() < lastMidnightInCET.valueOf()) {
            throw new HttpException("These are old memes. Please vote for newer ones", HttpStatus.FORBIDDEN)
        }

        if (isMeme && status.author.id === currentUser.id) {
            throw new HttpException(
                "We appreciate that you like your meme, but please vote for another one.",
                HttpStatus.FORBIDDEN
            );
        }

        if (await this.statusLikesRepository.existByStatusAndUserNotReverted(status, currentUser)) {
            throw new HttpException(
                "Current user has already liked this status",
                HttpStatus.FORBIDDEN
            );
        }

        if (isMeme && await this.statusLikesRepository.getAmountOfLikedMemesCreatedTodayByUser(currentUser) >= 1) {
            throw new ForbiddenException("You can vote for a meme here only once per day")
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

        await this.statusesRepository.increment({ id: status.id }, "favoritesCount", 1)
        status.favoritesCount += 1;

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

        const statusHashTags = status.hashTags.map(hashTag => hashTag.name);
        if (statusHashTags.includes("memezator")) {
            throw new HttpException(
                "Your vote is already in, please choose more wisely next time.",
                HttpStatus.FORBIDDEN
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

        await this.statusesRepository.decrement({ id: status.id }, "favoritesCount", 1)
        status.favoritesCount -= 1;

        return this.statusesMapper.toStatusResponseAsync(status, currentUser);
    }
}
