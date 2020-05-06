import {IsArray, IsDateString, IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested} from "class-validator";
import {BtfsUser} from "./BtfsUser";
import {BtfsMediaAttachment} from "./BtfsMediaAttachment";
import {StatusReferenceType} from "../../../statuses/entities";

export class BtfsStatus {
    @IsNotEmpty()
    @IsString()
    id: string;

    text: string;

    @IsNotEmpty()
    @IsNotEmptyObject()
    @ValidateNested()
    author: BtfsUser;

    @IsArray()
    @ValidateNested()
    mediaAttachments: BtfsMediaAttachment[];

    @IsNotEmpty()
    @IsDateString()
    createdAt: string;

    referredStatusId: string;

    statusReferenceType?: StatusReferenceType;

    constructor(plainObject: BtfsStatus) {
        this.id = plainObject.id;
        this.text = plainObject.text;
        this.author = new BtfsUser(plainObject.author);
        this.mediaAttachments = plainObject.mediaAttachments.map(mediaAttachment => new BtfsMediaAttachment(mediaAttachment));
        this.createdAt = plainObject.createdAt;
        this.referredStatusId = plainObject.referredStatusId;
    }
}
