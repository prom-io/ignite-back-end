import {Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Query, Req, UseGuards, UseInterceptors} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {StatusesService} from "./StatusesService";
import {StatusLikesService} from "./StatusLikesService";
import {CreateStatusRequest} from "./types/request";
import {StatusResponse} from "./types/response";
import {CreateCommentRequest} from "./types/request/CreateCommentRequest";
import {CommentResponse} from "./types/response/CommentResponse";
import {CommentsService} from "./CommentsService";
import {OptionalJwtAuthGuard} from "../jwt-auth/OptionalJwtAuthGuard";
import {User} from "../users/entities";
import {PaginationRequest} from "../utils/pagination";

@Controller("api/v1/statuses")
export class StatusesController {
    constructor(private readonly statusesService: StatusesService,
                private readonly statusLikesService: StatusLikesService,
                private readonly commentsService: CommentsService) {
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"))
    @Post()
    public createStatus(@Body() createStatusRequest: CreateStatusRequest,
                        @Req() request: Request): Promise<StatusResponse> {
        return this.statusesService.createStatus(createStatusRequest, request.user as User)
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(OptionalJwtAuthGuard)
    @Get(":id")
    public findStatusById(@Param("id") id: string,
                          @Req() request: Request): Promise<StatusResponse> {
        return this.statusesService.findStatusById(id, request.user as User | null);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"))
    @Post(":id/favourite")
    public likeStatus(@Param("id") id: string,
                      @Req() request: Request): Promise<StatusResponse> {
        return this.statusLikesService.createStatusLike(id, request.user as User);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"))
    @Post(":id/unfavourite")
    public unlikeStatus(@Param("id") id: string,
                        @Req() request: Request): Promise<StatusResponse> {
        return this.statusLikesService.deleteStatusLike(id, request.user as User);
    }

    @Get(":id/context")
    public getStatusContext(@Param("id") id: string) {
        return {
            ancestors: [],
            descendants: []
        }
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"))
    @Post(":id/comments")
    public createComment(@Param("id") id: string,
                         @Body() createCommentRequest: CreateCommentRequest,
                         @Req() request: Request): Promise<CommentResponse> {
        return this.commentsService.createComment(createCommentRequest, id, request.user as User);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(":id/comments")
    public getCommentsByStatus(@Param("id") id: string,
                               @Query() paginationRequest: PaginationRequest): Promise<CommentResponse[]> {
        return this.commentsService.findCommentsByStatus(id, paginationRequest);
    }
}
