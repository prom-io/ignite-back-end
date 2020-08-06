import {IsArray, IsString, IsOptional} from "class-validator";
import {ISignUpReferenceConfig} from "../ISignUpReferenceConfig";
import {Expose} from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateSignUpReferenceConfigRequest implements ISignUpReferenceConfig {
    @ApiProperty({ name: "accounts_to_subscribe", type: [String] })
    @Expose({name: "accounts_to_subscribe"})
    @IsArray()
    @IsString({each: true})
    accountsToSubscribe: string[];

    @ApiPropertyOptional({ name: "accounts_to_recommend", type: [String] })
    @Expose({name: "accounts_to_recommend"})
    @IsArray()
    @IsString({each: true})
    @IsOptional()
    accountsToRecommend?: string[];
}
