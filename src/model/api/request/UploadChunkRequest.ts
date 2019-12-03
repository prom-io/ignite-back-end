import {IsNotEmpty, IsString} from "class-validator";
import {IUploadChunkRequest} from "./IUploadChunkRequest";

export class UploadChunkRequest implements IUploadChunkRequest {
    @IsNotEmpty({message: "Chunk data must not be empty"})
    @IsString({message: "Chunk data must be represented as base64 string"})
    public chunkData: string;

    constructor(chunkData: string) {
        this.chunkData = chunkData;
    }
}
