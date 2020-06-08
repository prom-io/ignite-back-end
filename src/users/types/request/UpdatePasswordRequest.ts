import {IsNotEmpty, IsString, MinLength} from "class-validator";
import {IsStrongPassword, MustMatch} from "../../../utils/validation";
import {Expose} from "class-transformer";

export class UpdatePasswordRequest {
    @IsString()
    @IsNotEmpty()
    @Expose({name: "current_password"})
    currentPassword: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @IsStrongPassword()
    @Expose({name: "updated_password"})
    updatedPassword: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MustMatch("password", {message: "passwordConfirmation and password fields must match"})
    @Expose({name: "updated_password_confirmation"})
    passwordConfirmation: string;
}
