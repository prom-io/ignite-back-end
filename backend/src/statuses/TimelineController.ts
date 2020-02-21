import {ClassSerializerInterceptor, Controller, Get, Query, Req, UseGuards, UseInterceptors} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {FeedService} from "./FeedService";
import {StatusResponse} from "./types/response";
import {User} from "../users/entities";
import {OptionalJwtAuthGuard} from "../jwt-auth/OptionalJwtAuthGuard";

@Controller("api/v1/timelines")
export class TimelineController {
    constructor(private feedService: FeedService) {
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"))
    @Get("home")
    public getFeedOfCurrentUser(@Req() request: Request,
                                @Query("max_id") maxId?: string,
                                @Query("since_id") sinceId?: string): Promise<StatusResponse[]> {
        return this.feedService.getFeedOfCurrentUserAfter(request.user as User, {sinceId, maxId});
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(OptionalJwtAuthGuard)
    @Get("global")
    public getGlobalFeed(@Req() request: Request,
                         @Query("max_id") maxId?: string,
                         @Query("since_id") sinceId?: string): Promise<StatusResponse[]> {
        return this.feedService.getGlobalFeed({maxId, sinceId}, request.user as User | null);
    }
}
