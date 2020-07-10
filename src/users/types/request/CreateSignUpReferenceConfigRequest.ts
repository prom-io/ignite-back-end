import {IsArray, IsString} from "class-validator";
import {ISignUpReferenceConfig} from "../ISignUpReferenceConfig";
import {Expose} from "class-transformer";

export class CreateSignUpReferenceConfigRequest implements ISignUpReferenceConfig {
    @Expose({name: "accounts_to_subscribe"})
    @IsArray()
    @IsString({each: true})
    accountsToSubscribe: string[];
}
