import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class BtfsMediaAttachment {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNumber()
    width?: number;

    @IsNumber()
    height?: number;

    @IsString()
    mimeType: string;

    @IsString()
    format: string;

    @IsString()
    name: string;

    constructor(plainObject: BtfsMediaAttachment) {
        Object.assign(this, plainObject);
    }
}
