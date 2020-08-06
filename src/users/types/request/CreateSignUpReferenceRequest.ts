import {IsDateString, IsNumber, IsObject, ValidateIf, ValidateNested} from "class-validator";
import {Expose, Transform} from "class-transformer";
import {CreateSignUpReferenceConfigRequest} from "./CreateSignUpReferenceConfigRequest";
import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";

export class CreateSignUpReferenceRequest {
    @ApiPropertyOptional({ name: "expires_at", type: "string", format: "datetime" })
    @Expose({name: "expires_at"})
    @ValidateIf((object: CreateSignUpReferenceRequest) => Boolean(object.expiresAt))
    @IsDateString()
    @Transform(value => value ? new Date(value) : undefined)
    expiresAt?: Date;

    @ApiPropertyOptional({ name: "max_uses" })
    @ValidateIf((object: CreateSignUpReferenceRequest) => object.maxUses !== null && object.maxUses !== undefined)
    @IsNumber()
    @Expose({name: "max_uses"})
    maxUses?: number;

    @ApiProperty()
    @IsObject()
    @ValidateNested()
    config: CreateSignUpReferenceConfigRequest;
}
