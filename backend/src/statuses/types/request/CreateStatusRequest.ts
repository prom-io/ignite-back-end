import {ArrayMaxSize, IsNotEmpty, IsString, ValidateIf} from "class-validator";
import {Expose} from "class-transformer";

export class CreateStatusRequest {
    @IsNotEmpty({message: "Status text must not be empty"})
    @IsString({message: "Status text must be string"})
    @ValidateIf(object => !object.media_attachments || object.media_attachments.length === 0)
    public status: string;

    @ValidateIf(object => object.media_attachments)
    @ArrayMaxSize(10, {message: "You can attach up to 10 media attachments to status"})
    @Expose({name: "media_attachments"})
    // tslint:disable-next-line:variable-name
    public media_attachments: string[] = [];

    public repostedStatusId?: string;
}
