import {IsArray, IsString, IsOptional} from "class-validator";
import {ISignUpReferenceConfig} from "../ISignUpReferenceConfig";
import {Expose} from "class-transformer";

export class CreateSignUpReferenceConfigRequest implements ISignUpReferenceConfig {
    @Expose({name: "accounts_to_subscribe"})
    @IsArray()
    @IsString({each: true})
    accountsToSubscribe: string[];

    @Expose({name: "accounts_to_recommend"})
    @IsArray()
    @IsString({each: true})
    @IsOptional()
    accountsToRecommend?: string[];
}
