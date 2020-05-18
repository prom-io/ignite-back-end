import {OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway} from "@nestjs/websockets";
import {JwtService} from "@nestjs/jwt";
import {Socket} from "socket.io";
import {parse} from "querystring";
import {UserResponse} from "../users/types/response";
import {PublishWebsocketNotificationRequest} from "./types/response";

interface ConnectedUsersMap {
    [userEthereumAddress: string]: Socket[]
}

@WebSocketGateway({
    path: "/api/v1/websocket",
    transports: [
        "websocket",
        "polling"
    ]
})
export class WebsocketEventsPublisher implements OnGatewayConnection, OnGatewayDisconnect {
    private connectedUsersMap: ConnectedUsersMap = {};
    private connectedClients: Socket[] = [];

    constructor(private readonly jwtService: JwtService) {
    }

    public handleConnection(client: Socket, ...args: any[]): void {
        const queryParameters = client.handshake.query
            ? typeof client.handshake.query === "object" ? client.handshake.query : parse(client.handshake.query)
            : {};
        if (queryParameters.access_token) {
            const user = this.jwtService.verify<UserResponse>(queryParameters.access_token);
            if (this.connectedUsersMap[user.id]) {
                this.connectedUsersMap[user.id].push(client);
            } else {
                this.connectedUsersMap[user.id] = [client];
            }
        }

        this.connectedClients.push(client);
    }

    public handleDisconnect(client: Socket): void {
        this.connectedClients = this.connectedClients.filter(connectedClient => connectedClient.id !== client.id);

        const usersToDelete: string[] = [];

        Object.keys(this.connectedUsersMap).forEach(ethereumAddress => {
            if (this.connectedUsersMap[ethereumAddress] !== undefined) {
                this.connectedUsersMap[ethereumAddress] = this.connectedUsersMap[ethereumAddress]
                    .filter(connectedClient => connectedClient.id !== client.id);
                if (this.connectedUsersMap[ethereumAddress].length === 0) {
                    usersToDelete.push(ethereumAddress);
                }
            }
        });

        usersToDelete.forEach(ethereumAddress => delete this.connectedUsersMap[ethereumAddress]);
    }

    public publishWebsocketPushNotification(publishWebsocketNotificationRequest: PublishWebsocketNotificationRequest<any>): void {
        this.connectedUsersMap[publishWebsocketNotificationRequest.receiverEthereumAddress].forEach(client => {
            client.emit(
                publishWebsocketNotificationRequest.websocketPushNotification.type,
                publishWebsocketNotificationRequest.websocketPushNotification
            );
        });
    }
}
