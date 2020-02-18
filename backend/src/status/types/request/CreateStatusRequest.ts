import {IsNotEmpty, IsString, IsUUID} from "class-validator";

export class CreateStatusRequest {
    @IsNotEmpty({message: "Status text must not be empty"})
    @IsString({message: "Status text must be string"})
    public text: string;

    @IsString({message: "In reply to ID must be string"})
    public inReplyTo?: string;
}
