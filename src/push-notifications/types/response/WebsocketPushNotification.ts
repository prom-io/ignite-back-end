import {Expose} from "class-transformer";
import {NotificationType} from "../../entities";
import { ApiProperty } from "@nestjs/swagger";

export class WebsocketPushNotification<PayloadType> {
    @ApiProperty()
    id: string;

    @ApiProperty()
    type: NotificationType;

    @ApiProperty()
    payload: PayloadType;

    @ApiProperty()
    read: boolean;

    @ApiProperty()
    @Expose({name: "created_at"})
    createdAt: string;

    constructor(plainObject: WebsocketPushNotification<PayloadType>) {
        Object.assign(this, plainObject);
    }
}
