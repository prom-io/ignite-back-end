import {NotificationType} from "../../entities";

export class WebsocketPushNotification<PayloadType> {
    id: string;
    type: NotificationType;
    payload: PayloadType;

    constructor(plainObject: WebsocketPushNotification<PayloadType>) {
        Object.assign(this, plainObject);
    }
}
