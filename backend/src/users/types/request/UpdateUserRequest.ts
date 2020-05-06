import {Expose} from "class-transformer";
import {IsString, Matches, MaxLength, ValidateIf} from "class-validator";

export class UpdateUserRequest {
    @Expose({name: "display_name"})
    @IsString()
    @MaxLength(50)
    displayName?: string;

    @ValidateIf((object: UpdateUserRequest) => Boolean(object.username))
    @IsString()
    @Matches(/^[a-zA-Z0-9]+$/)
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
}
