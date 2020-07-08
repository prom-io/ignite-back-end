import {Expose} from "class-transformer";
import {IsBoolean, IsObject, IsString, MaxLength, ValidateIf, ValidateNested} from "class-validator";
import {UpdatePreferencesRequest} from "./UpdatePreferencesRequest";
import {IsValidUsername} from "../../../utils/validation";

export class UpdateUserRequest {
    @Expose({name: "display_name"})
    @IsString()
    @MaxLength(50)
    displayName?: string;

    @ValidateIf((object: UpdateUserRequest) => Boolean(object.username))
    @IsString()
    @IsValidUsername()
    @MaxLength(50)
    username?: string;

    @ValidateIf((object: UpdateUserRequest) => Boolean(object.avatarId))
    @IsString()
    @Expose({name: "avatar_id"})
    avatarId?: string;

    @ValidateIf((object: UpdateUserRequest) => Boolean(object.bio))
    @IsString()
    @MaxLength(400)
    bio?: string;

    @ValidateIf((object: UpdateUserRequest) => Boolean(object.preferences))
    @IsObject()
    @ValidateNested()
    preferences?: UpdatePreferencesRequest;

    @ValidateIf((object: UpdateUserRequest) => object.resetAvatar !== undefined && object.resetAvatar !== null)
    @IsBoolean()
    @Expose({name: "reset_avatar"})
    resetAvatar?: boolean;
}
