import {ArrayMaxSize, IsNotEmpty, IsString, ValidateIf} from "class-validator";

export class CreateCommentRequest {
    @IsNotEmpty({message: "Status text must not be empty"})
    @IsString({message: "Status text must be string"})
    @ValidateIf(object => {
        if (object.repostedStatusId) {
            return false;
        }

        return !(object.media_attachments && object.media_attachments.length !== 0);
    })
    public text?: string;

    @ValidateIf(object => object.media_attachments)
    @ArrayMaxSize(10, {message: "You can attach up to 10 media attachments to status"})
    // tslint:disable-next-line:variable-name
    public media_attachments?: string[] = [];

    // tslint:disable-next-line:variable-name
    public reposted_comment_id?: string;
}
