import {IsDateString, IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested} from "class-validator";
import {BtfsUser} from "./BtfsUser";

export class BtfsUserSubscription {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsNotEmptyObject()
    @ValidateNested()
    subscribedUser: BtfsUser;

    @IsNotEmpty()
    @IsNotEmptyObject()
    @ValidateNested()
    subscribedTo: BtfsUser;

    @IsNotEmpty()
    @IsDateString()
    createdAt: string;

    constructor(plainObject: BtfsUserSubscription) {
        this.id = plainObject.id;
        this.subscribedUser = new BtfsUser(plainObject.subscribedUser);
        this.subscribedTo = new BtfsUser(plainObject.subscribedTo);
        this.createdAt = plainObject.createdAt;
    }
}
