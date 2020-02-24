import {IsString, IsNotEmpty, Matches} from "class-validator";
import {IsValidEthereumPrivateKey} from "../../../utils/validation";

export class CreateDataValidatorRequest {
    @IsString({message: "Address must be string"})
    @IsNotEmpty({message: "Address must not be empty"})
    /*@Matches(
        new RegExp("^0x[a-fA-F0-9]{40}$"),
        {
            message: "Address must be valid Ethereum address"
        }
    )*/
    public address: string;

    @IsString({message: "Private key must be string"})
    @IsNotEmpty({message: "Private key must not be empty"})
    // @IsValidEthereumPrivateKey("address")
    public privateKey: string;

    constructor(address: string, privateKey: string) {
        this.address = address;
        this.privateKey = privateKey;
    }
}
