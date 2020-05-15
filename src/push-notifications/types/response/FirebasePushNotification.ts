import {NotificationType} from "../../entities";

export class FirebasePushNotification {
    id?: string;
    type: NotificationType;
    jsonPayload: string;

    constructor(plainObject: FirebasePushNotification) {
        Object.assign(this, plainObject);
    }
}
