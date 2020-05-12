import {BtfsStatus} from "./BtfsStatus";
import {BtfsUser} from "./BtfsUser";
import {IsDateString, IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested} from "class-validator";

export class BtfsStatusLike {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsNotEmptyObject()
    @ValidateNested()
    status: BtfsStatus;

    @IsNotEmpty()
    @IsNotEmptyObject()
    @ValidateNested()
    user: BtfsUser;

    @IsNotEmpty()
    @IsDateString()
    createdAt: string;

    constructor(plainObject: BtfsStatusLike) {
        this.id = plainObject.id;
        this.status = new BtfsStatus(plainObject.status);
        this.user = new BtfsUser(plainObject.user);
        this.createdAt = plainObject.createdAt;
    }
}
