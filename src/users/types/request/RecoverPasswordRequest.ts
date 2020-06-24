import {IsNotEmpty, IsString, Matches, MinLength, ValidateIf} from "class-validator";
import {Expose} from "class-transformer";
import {
    IsStrongPassword,
    IsValidEthereumAddress,
    IsValidEthereumPrivateKey,
    MustMatch
} from "../../../utils/validation";

export class RecoverPasswordRequest {
    @ValidateIf((object: RecoverPasswordRequest) => !Boolean(object.transactionId))
    @IsString()
    @IsNotEmpty()
    @IsValidEthereumAddress()
    @Expose({name: "wallet_address"})
    walletAddress?: string;

    @ValidateIf((object: RecoverPasswordRequest) => !Boolean(object.transactionId))
    @IsString()
    @IsNotEmpty()
    @IsValidEthereumPrivateKey("walletAddress")
    @Expose({name: "private_key"})
    privateKey?: string;

    @ValidateIf((object: RecoverPasswordRequest) => !Boolean(object.transactionId))
    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password?: string;

    @ValidateIf((object: RecoverPasswordRequest) => !Boolean(object.transactionId))
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MustMatch("password", {message: "passwordConfirmation and password fields must match"})
    @Expose({name: "password_confirmation"})
    passwordConfirmation?: string;

    @ValidateIf((object: RecoverPasswordRequest) => Boolean(object.transactionId))
    @IsNotEmpty()
    @IsString()
    @Expose({name: "transaction_id"})
    transactionId?: string
}
