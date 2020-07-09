import {IsArray} from "class-validator";

export class UsersSubscribersInfoRequest {
    @IsArray()
    addresses: string[]
}
