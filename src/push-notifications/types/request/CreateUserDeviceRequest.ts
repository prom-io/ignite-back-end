import {Expose} from "class-transformer";
import {IsNotEmpty, IsString} from "class-validator";

export class CreateUserDeviceRequest {
    @IsNotEmpty()
    @IsString()
    @Expose({name: "fcm_token"})
    fcmToken: string;
}
