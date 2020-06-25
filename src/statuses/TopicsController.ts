import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Query,
    Req,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {Request} from "express";
import {TopicsService} from "./TopicsService";
import {HashTagResponse, StatusResponse} from "./types/response";
import {GetStatusesByTopicRequest, GetHashTagsRequest} from "./types/request";
import {getLanguageFromString, User} from "../users/entities";
import {OptionalJwtAuthGuard} from "../jwt-auth/OptionalJwtAuthGuard";

@Controller("api/v1/topics")
export class TopicsController {
    constructor(private readonly topicsService: TopicsService) {
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    public getHashTags(@Query() getHashTagsRequest: GetHashTagsRequest): Promise<HashTagResponse[]> {
        return this.topicsService.getHashTags(getHashTagsRequest);
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
    @UseGuards(OptionalJwtAuthGuard)
    @Get(":hashTag/statuses")
    public findStatusesByHashTag(@Param("hashTag") hashTag: string,
                                 @Req() request: Request,
                                 @Query() getStatusesByTopicRequest: GetStatusesByTopicRequest): Promise<StatusResponse[]> {
        return this.topicsService.findStatusesByHashTag(
            hashTag,
            getStatusesByTopicRequest,
            request.user as User | null
        );
    }
}
