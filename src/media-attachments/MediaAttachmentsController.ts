import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Post,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    Query
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {FileInterceptor} from "@nestjs/platform-express";
import {Response} from "express";
import {MediaAttachmentResponse, MultipartFile, MediaAttachmentOptions} from "./types";
import {MediaAttachmentsService} from "./MediaAttachmentsService";

@Controller("api/v1/media")
export class MediaAttachmentsController {
    constructor(private readonly mediaAttachmentsService: MediaAttachmentsService) {
    }

    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(ClassSerializerInterceptor)
    @UseInterceptors(FileInterceptor("file"))
    @Post()
    public uploadMedia(@UploadedFile() file: MultipartFile): Promise<MediaAttachmentResponse> {
        return this.mediaAttachmentsService.saveMediaAttachment(file);
    }

    @Get(":name")
    public getAttachmentByName(
        @Param("name") name: string,
        @Query() options: MediaAttachmentOptions,
        @Res() response: Response
    ): Promise<void> {
        return this.mediaAttachmentsService.getMediaAttachmentByName(name, response, options);
    }
}
