import {Expose, Transform} from "class-transformer";
import {IsBoolean, IsObject, IsString, MaxLength, ValidateIf, ValidateNested, IsUrl, IsOptional} from "class-validator";
import {UpdatePreferencesRequest} from "./UpdatePreferencesRequest";
import {IsValidUsername, ValidatedObjectWithCurrentUser} from "../../../utils/validation";

export class UpdateUserRequest extends ValidatedObjectWithCurrentUser {
    @Expose({name: "display_name"})
    @IsString()
    @MaxLength(50)
    displayName?: string;

    @Expose()
    @IsString()
    @IsValidUsername()
    @MaxLength(50)
    @Transform((name) => name.toLowerCase())
    username?: string;

    @ValidateIf((object: UpdateUserRequest) => Boolean(object.avatarId))
    @IsString()
    @Expose({name: "avatar_id"})
    avatarId?: string;

    @ValidateIf((object: UpdateUserRequest) => Boolean(object.bio))
    @IsString()
    @MaxLength(400)
    bio?: string;

    @MaxLength(100)
    @IsUrl()
    @IsOptional()
    @Expose({name: "external_url"})
    externalUrl?: string

    @ValidateIf((object: UpdateUserRequest) => Boolean(object.preferences))
    @IsObject()
    @ValidateNested()
    preferences?: UpdatePreferencesRequest;

    @ValidateIf((object: UpdateUserRequest) => object.resetAvatar !== undefined && object.resetAvatar !== null)
    @IsBoolean()
    @Expose({name: "reset_avatar"})
    resetAvatar?: boolean;
}
