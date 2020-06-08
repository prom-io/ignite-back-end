import {IsNotEmpty, IsString, Matches, MinLength, ValidateIf} from "class-validator";
import {Expose} from "class-transformer";
import {IsValidEthereumAddress, IsValidEthereumPrivateKey, MustMatch} from "../../../utils/validation";

export class UpdatePasswordRequest {
    @ValidateIf((object: UpdatePasswordRequest) => !Boolean(object.transactionId))
    @IsString()
    @IsNotEmpty()
    @IsValidEthereumAddress()
    @Expose({name: "wallet_address"})
    walletAddress?: string;

    @ValidateIf((object: UpdatePasswordRequest) => !Boolean(object.transactionId))
    @IsString()
    @IsNotEmpty()
    @IsValidEthereumPrivateKey("walletAddress")
    @Expose({name: "private_key"})
    privateKey?: string;

    @ValidateIf((object: UpdatePasswordRequest) => !Boolean(object.transactionId))
    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    @Matches(
        new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#\$%\^&\*])(?=.{8,})"),
        {message: "Password isn't strong enough"}
    )
    password?: string;

    @ValidateIf((object: UpdatePasswordRequest) => !Boolean(object.transactionId))
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MustMatch("password", {message: "passwordConfirmation and password fields must match"})
    @Expose({name: "password_confirmation"})
    passwordConfirmation?: string;

    @ValidateIf((object: UpdatePasswordRequest) => Boolean(object.transactionId))
    @IsNotEmpty()
    @IsString()
    @Expose({name: "transaction_od"})
    transactionId?: string
}
