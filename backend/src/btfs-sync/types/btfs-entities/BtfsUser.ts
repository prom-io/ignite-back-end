import {IsDateString, IsNotEmpty, IsString, Matches} from "class-validator";

export class BtfsUser {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @Matches(new RegExp("^0x[a-fA-F0-9]{40}$"))
    address: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    displayedName: string;

    @IsNotEmpty()
    @IsDateString()
    createdAt: string;
    avatarUri?: string;

    constructor(plainObject: BtfsUser) {
        Object.assign(this, plainObject);
    }
}
