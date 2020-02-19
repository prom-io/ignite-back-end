import {Controller, Get, Query, Req, UseGuards} from "@nestjs/common";
import {Request} from "express";
import {FeedService} from "./FeedService";
import {PaginationRequest} from "../utils/pagination";
import {StatusResponse} from "./types/response";
import {User} from "../users/entities";
import {AuthGuard} from "@nestjs/passport";

@Controller("api/v3/feed")
export class FeedController {
    constructor(private feedService: FeedService) {
    }

    @UseGuards(AuthGuard("jwt"))
    @Get()
    public getFeedOfCurrentUser(@Req() request: Request,
                                @Query() paginationRequest: PaginationRequest): Promise<StatusResponse[]> {
        return this.feedService.getFeedOfCurrentUser(request.user as User, paginationRequest);
    }
}
