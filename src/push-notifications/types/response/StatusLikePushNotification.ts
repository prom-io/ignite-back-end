import {Expose} from "class-transformer";
import {UserResponse} from "../../../users/types/response";
import {StatusResponse} from "../../../statuses/types/response";

export class StatusLikePushNotification {
    @Expose({name: "liked_by"})
    likedBy: UserResponse;

    @Expose({name: "liked_status"})
    likedStatus: StatusResponse;

    constructor(plainObject: StatusLikePushNotification) {
        Object.assign(this, plainObject);
    }
}
