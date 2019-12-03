import {IsString, IsNotEmpty, Matches} from "class-validator";

export class CreateDataValidatorRequest {
    @IsString({message: "Address must be string"})
    @IsNotEmpty({message: "Address must not be empty"})
    @Matches(
        new RegExp("^0x[a-fA-F0-9]{40}$"),
        {
            message: "Address must be valid Ethereum address"
        }
    )
    public address: string;

    constructor(address: string) {
        this.address = address;
    }
}
