import {IsArray} from "class-validator";
import {Expose} from "class-transformer";

export class MarkNotificationsReadRequest {
    @IsArray()
    @Expose({name: "notifications_ids"})
    notificationsIds: string[];
}
