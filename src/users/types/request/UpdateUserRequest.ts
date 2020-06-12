import {Expose} from "class-transformer";
import {IsBoolean, IsObject, IsString, Matches, MaxLength, ValidateIf, ValidateNested} from "class-validator";
import {UpdatePreferencesRequest} from "./UpdatePreferencesRequest";

export class UpdateUserRequest {
    @Expose({name: "display_name"})
    @IsString()
    @MaxLength(50)
    displayName?: string;

    @ValidateIf((object: UpdateUserRequest) => Boolean(object.username))
    @IsString()
    @Matches(/^[a-zA-Z0-9\u3130-\u318F\uAC00-\uD7AF\u4E00-\u9FFF\u3400-\u4DBF\u20000-\u2A6DF\u2A700-\u2B73F\u2B740-\u2B81F\u2B820-\u2CEAF\uF900-\uFAFF\u2F800-\u2FA1F_]+$/)
    @MaxLength(30)
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
