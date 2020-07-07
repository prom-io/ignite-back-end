import {
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {TopicsService} from "./TopicsService";
import {HashTagResponse, StatusResponse} from "./types/response";
import {fromString, GetHashTagsRequest} from "./types/request";
import {getLanguageFromString, User} from "../users/entities";
import {OptionalJwtAuthGuard} from "../jwt-auth/OptionalJwtAuthGuard";

@Controller("api/v1/topics")
export class TopicsController {
    constructor(private readonly topicsService: TopicsService) {
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(OptionalJwtAuthGuard)
    @Get()
    public getHashTags(@Query() getHashTagsRequest: GetHashTagsRequest, @Req() request: Request): Promise<HashTagResponse[]> {
        return this.topicsService.getHashTags(getHashTagsRequest, request.user as User | null);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(OptionalJwtAuthGuard)
    @Get(":name")
    public getHashTag(@Param("name") name: string,
                      @Req() request: Request,
                      @Query("language") language?: string): Promise<HashTagResponse> {
        return this.topicsService.getHashTagByNameAndLanguage(name, getLanguageFromString(language), request.user as User | null);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"))
    @Post(":id/follow")
    public followHashTag(@Param("id") id: string,
                         @Req() request: Request): Promise<HashTagResponse> {
        return this.topicsService.followHashTag(id, request.user as User);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"))
    @Delete(":id/unfollow")
    public unfollowHashTag(@Param("id") id: string,
                           @Req() request: Request): Promise<HashTagResponse> {
        return this.topicsService.unfollowHashTag(id, request.user as User);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(OptionalJwtAuthGuard)
    @Get(":hashTag/statuses")
    public findStatusesByHashTag(@Param("hashTag") hashTag: string,
                                 @Req() request: Request,
                                 @Query("since_id") sinceId?: string,
                                 @Query("max_id") maxId?: string,
                                 @Query("type") type?: string,
                                 @Query("language") language?: string): Promise<StatusResponse[]> {
        return this.topicsService.findStatusesByHashTag(
            hashTag,
            {
                sinceId,
                maxId,
                type: fromString(type),
                language: getLanguageFromString(language)
            },
            request.user as User | null
        );
    }
}
