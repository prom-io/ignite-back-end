import {Expose, Transform, Type} from "class-transformer";
import {IsIn, IsNotEmpty, IsString, Matches, MinLength, ValidateIf} from "class-validator";
import {
    IsStrongPassword,
    IsValidEthereumAddress,
    IsValidEthereumPrivateKey,
    MustMatch
} from "../../../utils/validation";
import {getLanguageFromString, Language} from "../../entities";

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
    @IsStrongPassword()
    password: string | undefined;

    @ValidateIf((object: SignUpRequest) => !Boolean(object.transactionId))
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MustMatch("password", {message: "passwordConfirmation and password fields must match"})
    @Expose({name: "password_confirmation"})
    passwordConfirmation: string | undefined;

    @Transform(value => getLanguageFromString(value as string))
    @ValidateIf((object: SignUpRequest) => Boolean(object.language))
    @IsString()
    @IsIn([Language.KOREAN, Language.ENGLISH, "kr"])
    language: Language | undefined;

    @ValidateIf((object: SignUpRequest) => Boolean(object.transactionId))
    @IsString()
    @IsNotEmpty()
    @Expose({name: "transaction_id"})
    transactionId: string | undefined;

    @ValidateIf((object: SignUpRequest) => Boolean(object.referenceId))
    @IsString()
    @Expose({name: "reference_id"})
    referenceId?: string;
}
