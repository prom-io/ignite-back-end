import {IsNotEmpty, IsString} from "class-validator";

export class CreateStatusRequest {
    @IsNotEmpty({message: "Status text must not be empty"})
    @IsString({message: "Status text must be string"})
    public status: string;
}
