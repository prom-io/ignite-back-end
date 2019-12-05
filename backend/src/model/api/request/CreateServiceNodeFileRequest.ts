import {IsNotEmpty, IsString, Matches, IsInt, IsDateString} from "class-validator";
import {ICreateServiceNodeFileRequest} from "./ICreateServiceNodeFileRequest";
import {FileMetadata} from "../../entity";

export class CreateServiceNodeFileRequest implements ICreateServiceNodeFileRequest {
    @IsNotEmpty({message: "Keep until date must be specified"})
    @IsDateString({message: "Keep until must be date string"})
    public keepUntil: string;

    @IsNotEmpty({message: "Name must be specified"})
    @IsString({message: "Name must be string"})
    public name: string;
    public additional: FileMetadata;

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

    constructor(keepUntil: string,
                name: string,
                additional: FileMetadata,
                dataOwnerAddress: string,
                extension: string,
                mimeType: string,
                size: number,
                serviceNodeAddress: string,
                dataValidatorAddress: string
    ) {
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