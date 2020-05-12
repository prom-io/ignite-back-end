import {IsArray, IsDateString, IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested} from "class-validator";
import {BtfsUser} from "./BtfsUser";
import {BtfsMediaAttachment} from "./BtfsMediaAttachment";
import {BtfsStatus} from "./BtfsStatus";

export class BtfsComment {
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

    @IsNotEmpty()
    @IsNotEmptyObject()
    @ValidateNested()
    status: BtfsStatus;

    constructor(plainObject: BtfsComment) {
        this.id = plainObject.id;
        this.text = plainObject.text;
        this.author = new BtfsUser(plainObject.author);
        this.mediaAttachments = plainObject.mediaAttachments.map(mediaAttachment => new BtfsMediaAttachment(mediaAttachment));
        this.createdAt = plainObject.createdAt;
        this.status = new BtfsStatus(plainObject.status);
    }
}
