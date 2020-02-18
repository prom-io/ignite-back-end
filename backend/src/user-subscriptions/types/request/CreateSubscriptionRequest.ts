import {IsNotEmpty, IsString} from "class-validator";

export class CreateSubscriptionRequest {
    @IsNotEmpty({message: "Subscribe to must not be empty"})
    @IsString({message: "Subscribe to address must be string"})
    public subscribeToAddress: string;

    
}
