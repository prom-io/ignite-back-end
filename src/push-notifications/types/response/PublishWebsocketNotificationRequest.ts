import {WebsocketPushNotification} from "./WebsocketPushNotification";

export interface PublishWebsocketNotificationRequest<WebsocketPushNotificationPayloadType> {
    websocketPushNotification: WebsocketPushNotification<WebsocketPushNotificationPayloadType>,
    receiverEthereumAddress: string
}
