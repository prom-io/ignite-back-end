import {IsNotEmpty, IsString, Matches, MinLength} from "class-validator";

export class GeneratePasswordHashRequest {
    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    @Matches(
        new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#\$%\^&\*])(?=.{8,})"),
        {message: "Password isn't strong enough"}
    )
    password: string;
}
