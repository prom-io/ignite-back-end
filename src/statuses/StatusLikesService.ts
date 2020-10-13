import { TransactionsRepository } from './../transactions/TransactionsRepository';
import { TokenExchangeService } from './../token-exchange/token-exchange.service';
import {HttpException, HttpStatus, Injectable, ForbiddenException} from "@nestjs/common";
import uuid from "uuid/v4";
import {StatusLike} from "./entities";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {StatusesRepository} from "./StatusesRepository";
import {StatusesMapper} from "./StatusesMapper";
import {StatusResponse} from "./types/response";
import {User} from "../users/entities";
import { MEMEZATOR_HASHTAG } from "../common/constants";
import { UsersService } from "../users";
import { HttpExceptionWithCode } from "../common/http-exception-with-code";
import { ErrorCode } from "../common/error-code";
import { getCurrentMemezatorContestStartTime } from "../memezator/utils";

@Injectable()
export class StatusLikesService {
    constructor(
        private readonly statusLikesRepository: StatusLikesRepository,
        private readonly statusesRepository: StatusesRepository,
        private readonly statusesMapper: StatusesMapper,
        private readonly usersService: UsersService,
        private readonly tokenExchangeService: TokenExchangeService,
        private readonly transactionsRepository: TransactionsRepository,
    ) {}

    public async createStatusLike(statusId: string, currentUser: User): Promise<StatusResponse> {
        const status = await this.statusesRepository.findById(statusId);
        if (!status) {
            throw new HttpExceptionWithCode(
                `Could not find status with id ${statusId}`,
                HttpStatus.NOT_FOUND,
                ErrorCode.STATUS_NOT_FOUND,
            )
        }

        const isMeme = status.hashTags.some(hashTag => hashTag.name === MEMEZATOR_HASHTAG)
        const currentMemezatorContestStartTime = getCurrentMemezatorContestStartTime()

        if (isMeme && status.createdAt.valueOf() < currentMemezatorContestStartTime.valueOf()) {
            throw new HttpExceptionWithCode(
                "These are old memes. Please vote for newer ones",
                HttpStatus.FORBIDDEN,
                ErrorCode.CANNOT_VOTE_FOR_OLD_MEMES,
            )
        }

        const ethereumBalance = await this.tokenExchangeService.getBalanceInProms(currentUser.ethereumAddress)
        const binanceBalance = await this.transactionsRepository.getBalanceByAddress(currentUser.ethereumAddress)
        const userTotalBalance = Number(binanceBalance) + Number(ethereumBalance)

        if(isMeme && userTotalBalance < 2) {
            throw new HttpExceptionWithCode(
                "Your balance amount is not enough for voting.",
                HttpStatus.FORBIDDEN,
                ErrorCode.BALANCE_IS_NOT_ENOUGH_TO_VOTE
            )
        }

        if (isMeme && status.author.id === currentUser.id) {
            throw new HttpExceptionWithCode(
                "We appreciate that you like your meme, but please vote for another one.",
                HttpStatus.FORBIDDEN,
                ErrorCode.CANNOT_VOTE_FOR_OWN_MEME,
            )
        }

        if (await this.statusLikesRepository.existByStatusAndUserNotReverted(status, currentUser)) {
            throw new HttpExceptionWithCode(
                "Current user has already liked this status",
                HttpStatus.FORBIDDEN,
                ErrorCode.YOU_ALREADY_LIKED_THIS_STATUS,
            )
        }

        if (isMeme) {
            const memeVotingRight = await this.usersService.getMemeVotingRightForUser(currentUser)
            if (!memeVotingRight.canVote) {
                throw new HttpExceptionWithCode(
                    "You can vote for a meme here only once per day",
                    HttpStatus.FORBIDDEN,
                    memeVotingRight.cannotVoteReasonCode
                )
            }
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
            throw new HttpExceptionWithCode(
                `Could not find status with id ${statusId}`,
                HttpStatus.NOT_FOUND,
                ErrorCode.STATUS_NOT_FOUND,
            )
        }

        const isMeme = status.hashTags.some(hashTag => hashTag.name === MEMEZATOR_HASHTAG)
        if (isMeme) {
            throw new HttpExceptionWithCode(
                "Your vote is already in, please choose more wisely next time.",
                HttpStatus.FORBIDDEN,
                ErrorCode.CANNOT_DISLIKE_A_MEME,
            )
        }
        
        const statusLike = await this.statusLikesRepository.findByStatusAndUserNotReverted(status, currentUser);

        if (!statusLike) {
            throw new HttpExceptionWithCode(
                "Statuses which have not been liked by current user can't be unliked",
                HttpStatus.FORBIDDEN,
                ErrorCode.STATUS_HAVE_NOT_BEEN_LIKED,
            )
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
