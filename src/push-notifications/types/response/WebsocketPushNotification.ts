import {Expose} from "class-transformer";
import {NotificationType} from "../../entities";

export class WebsocketPushNotification<PayloadType> {
    id: string;
    type: NotificationType;
    payload: PayloadType;
    read: boolean;

    @Expose({name: "created_at"})
    createdAt: string;

    constructor(plainObject: WebsocketPushNotification<PayloadType>) {
        Object.assign(this, plainObject);
    }
}
