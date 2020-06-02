import {Expose} from "class-transformer";
import {IsIn, IsNotEmpty, IsString, Matches, MinLength, ValidateIf} from "class-validator";
import {IsValidEthereumAddress, IsValidEthereumPrivateKey, MustMatch} from "../../../utils/validation";
import {Language} from "../../entities";

export class SignUpRequest {
    @ValidateIf((object: SignUpRequest) => !Boolean(object.transactionId))
    @IsString()
    @IsNotEmpty()
    @IsValidEthereumAddress()
    @Expose({name: "wallet_address"})
    walletAddress: string | undefined;

    @ValidateIf((object: SignUpRequest) => !Boolean(object.transactionId))
    @IsString()
    @IsNotEmpty()
    @IsValidEthereumPrivateKey("walletAddress")
    @Expose({name: "private_key"})
    privateKey: string | undefined;

    @ValidateIf((object: SignUpRequest) => !Boolean(object.transactionId))
    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    @Matches(
        new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#\$%\^&\*])(?=.{8,})"),
        {message: "Password isn't strong enough"}
    )
    password: string | undefined;

    @ValidateIf((object: SignUpRequest) => !Boolean(object.transactionId))
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MustMatch("password", {message: "passwordConfirmation and password fields must match"})
    @Expose({name: "password_confirmation"})
    passwordConfirmation: string | undefined;

    @ValidateIf((object: SignUpRequest) => Boolean(object.language))
    @IsString()
    @IsIn([Language.KOREAN, Language.ENGLISH])
    language: Language | undefined;

    @ValidateIf((object: SignUpRequest) => Boolean(object.transactionId))
    @IsString()
    @IsNotEmpty()
    @Expose({name: "transaction_id"})
    transactionId: string | undefined;
}
