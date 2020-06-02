import {Expose} from "class-transformer";
import {IsIn, IsNotEmpty, IsString, Matches, MinLength, ValidateIf} from "class-validator";
import {IsValidEthereumAddress, IsValidEthereumPrivateKey, MustMatch} from "../../../utils/validation";
import {Language} from "../../entities";

export class SignUpRequest {
    @IsString()
    @IsNotEmpty()
    @IsValidEthereumAddress()
    @Expose({name: "wallet_address"})
    walletAddress: string;

    @IsString()
    @IsNotEmpty()
    @IsValidEthereumPrivateKey("walletAddress")
    @Expose({name: "private_key"})
    privateKey: string;

    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    @Matches(
        new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#\$%\^&\*])(?=.{8,})"),
        {message: "Password isn't strong enough"}
    )
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MustMatch("password", {message: "passwordConfirmation and password fields must match"})
    @Expose({name: "password_confirmation"})
    passwordConfirmation: string;

    @ValidateIf((object: SignUpRequest) => Boolean(object.language))
    @IsString()
    @IsIn([Language.KOREAN, Language.ENGLISH])
    language: Language | undefined;
}
