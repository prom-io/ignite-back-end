import {Expose} from "class-transformer";
import {NotificationType} from "../../entities";

export class FirebasePushNotification {
    id?: string;
    type: NotificationType;

    @Expose({name: "json_payload"})
    jsonPayload: string;

    @Expose({name: "created_at"})
    createdAt: string;

    constructor(plainObject: FirebasePushNotification) {
        Object.assign(this, plainObject);
    }
}
