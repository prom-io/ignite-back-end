import {IsDateString, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Matches, ValidateNested} from "class-validator";
import {CreateFileMetadataRequest} from "./CreateFileMetadataRequest";

export class CreateLocalFileRequest {
    @IsNotEmpty({message: "Keep until date must be specified"})
    @IsDateString({message: "Keep until must be date string"})
    public keepUntil: string;

    @IsNotEmpty({message: "Name must be specified"})
    @IsString({message: "Name must be string"})
    public name: string;

    @ValidateNested()
    public additional: CreateFileMetadataRequest;

    @IsNotEmpty({message: "Data owner address must be specified"})
    @IsString({message: "Data owner address must be string"})
    @Matches(
        new RegExp("^0x[a-fA-F0-9]{40}$"),
        {
            message: "Data owner address must be valid Ethereum address"
        }
    )
    public dataOwnerAddress: string;

    @IsNotEmpty({message: "File extension must be present"})
    @IsString({message: "File extension must be string"})
    public extension: string;

    @IsNotEmpty({message: "File mime type must be present"})
    @IsString({message: "File mime type must be string"})
    public mimeType: string;

    @IsNotEmpty({message: "File size must be present"})
    @IsInt({message: "File size must be integer number which represents size in bytes"})
    @IsPositive({message: "Size must be positive"})
    public size: number;

    public serviceNodeAddress?: string;

    @IsNotEmpty({message: "Data owner address must be specified"})
    @IsString({message: "Data owner address must be string"})
    @Matches(
        new RegExp("^0x[a-fA-F0-9]{40}$"),
        {
            message: "Data validator address must be valid Ethereum address"
        }
    )
    public dataValidatorAddress: string;

    @IsNotEmpty({message: "File price must be present"})
    @IsNumber({allowInfinity: false, allowNaN: false}, {message: "File price must be integer number which represents size in bytes"})
    @IsPositive({message: "Price must be positive"})
    public price: number;

    // tslint:disable-next-line:max-line-length
    constructor(keepUntil: string, name: string, additional: CreateFileMetadataRequest, dataOwnerAddress: string, extension: string, mimeType: string, size: number, serviceNodeAddress: string, dataValidatorAddress: string) {
        this.keepUntil = keepUntil;
        this.name = name;
        this.additional = additional;
        this.dataOwnerAddress = dataOwnerAddress;
        this.extension = extension;
        this.mimeType = mimeType;
        this.size = size;
        this.serviceNodeAddress = serviceNodeAddress;
        this.dataValidatorAddress = dataValidatorAddress;
    }
}
