import {IsNotEmpty, IsString} from "class-validator";
import {Expose} from "class-transformer";
import {MediaAttachmentResponse} from "../../../media-attachments/types";

export class CreateStatusRequest {
    @IsNotEmpty({message: "Status text must not be empty"})
    @IsString({message: "Status text must be string"})
    public status: string;

    @Expose({name: "media_attachments"})
    public media_attachments: MediaAttachmentResponse[] = [];
}
