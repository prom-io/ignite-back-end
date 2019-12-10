import {IsNotEmpty, IsString, Matches} from "class-validator";
import {ICreateDataOwnerRequest} from "./ICreateDataOwnerRequest";

export class CreateDataOwnerRequest implements ICreateDataOwnerRequest {
    @IsString({message: "Address must be string"})
    @IsNotEmpty({message: "Address must not be empty"})
    @Matches(
        new RegExp("^0x[a-fA-F0-9]{40}$"),
        {
            message: "Address must be valid Ethereum address"
        }
    )
    public address: string;

    @IsString({message: "Data validator address must be string"})
    @IsNotEmpty({message: "Data validator address must not be empty"})
    @Matches(
        new RegExp("^0x[a-fA-F0-9]{40}$"),
        {
            message: "Data validator address must be valid Ethereum address"
        }
    )
    public dataValidatorAddress: string;

    @IsString({message: "Private key must be string"})
    @IsNotEmpty({message: "Private key must not be empty"})
    public privateKey: string;

    constructor(address: string, dataValidatorAddress: string, privateKey: string) {
        this.address = address;
        this.dataValidatorAddress = dataValidatorAddress;
        this.privateKey = privateKey;
    }
}
