import {ArrayMaxSize, IsIn, IsNotEmpty, IsString, MaxLength, ValidateIf, IsOptional, IsBoolean} from "class-validator";
import {Expose} from "class-transformer";
import {StatusReferenceType} from "../../entities/StatusReferenceType";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateStatusRequest {
    @ApiPropertyOptional()
    @ValidateIf((object: CreateStatusRequest) => {
        if (object.referredStatusId && object.statusReferenceType === StatusReferenceType.REPOST) {
            return false;
        }

        return !(object.mediaAttachments && object.mediaAttachments.length !== 0);
    })
    @IsNotEmpty({message: "Status text must not be empty"})
    @IsString({message: "Status text must be string"})
    @MaxLength(1000)
    public status?: string;

    @ApiPropertyOptional({ type: [String], name: "media_attachments" })
    @ValidateIf((object: CreateStatusRequest) => Boolean(object.mediaAttachments))
    @ArrayMaxSize(10, {message: "You can attach up to 10 media attachments to status"})
    @Expose({name: "media_attachments"})
    public mediaAttachments: string[] = [];

    @ApiPropertyOptional({ name: "referred_status_id" })
    @ValidateIf((object: CreateStatusRequest) => Boolean(object.referredStatusId))
    @IsString({message: "Referenced status id must be string"})
    @Expose({name: "referred_status_id"})
    public referredStatusId?: string;

    @ApiPropertyOptional({ name: "status_reference_type", enum: StatusReferenceType, enumName: "StatusReferenceType" })
    @ValidateIf((object: CreateStatusRequest) => Boolean(object.referredStatusId))
    @IsString()
    @IsNotEmpty()
    @IsIn([StatusReferenceType.REPOST, StatusReferenceType.COMMENT])
    @Expose({name: "status_reference_type"})
    public statusReferenceType?: StatusReferenceType;

    @ApiPropertyOptional({ name: "from_memezator" })
    @IsBoolean()
    @IsOptional()
    @Expose({name: "from_memezator"})
    public fromMemezator?: boolean;
}
