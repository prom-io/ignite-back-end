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
import {StatusResponse} from "./types/response";
import {getLanguageFromString, User} from "../users/entities";
import {OptionalJwtAuthGuard} from "../jwt-auth/OptionalJwtAuthGuard";

@Controller("api/v1/topics")
export class TopicsController {
    constructor(private readonly topicsService: TopicsService) {
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(OptionalJwtAuthGuard)
    @Get(":hashTag")
    public findStatusesByHashTag(@Param("hashTag") hashTag: string,
                                 @Req() request: Request,
                                 @Query("since_id") sinceId?: string,
                                 @Query("max_id") maxId?: string,
                                 @Query("language") language?: string): Promise<StatusResponse[]> {
        return this.topicsService.findStatusesByHashTag(
            hashTag,
            {sinceId, maxId},
            getLanguageFromString(language),
            request.user as User | null
        );
    }
}
