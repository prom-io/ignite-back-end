import {IsDateString, IsNumber, IsObject, ValidateIf, ValidateNested} from "class-validator";
import {Expose, Transform} from "class-transformer";
import {CreateSignUpReferenceConfigRequest} from "./CreateSignUpReferenceConfigRequest";

export class CreateSignUpReferenceRequest {
    @Expose({name: "expires_at"})
    @ValidateIf((object: CreateSignUpReferenceRequest) => Boolean(object.expiresAt))
    @IsDateString()
    @Transform(value => value ? new Date(value) : undefined)
    expiresAt?: Date;

    @ValidateIf((object: CreateSignUpReferenceRequest) => object.maxUses !== null && object.maxUses !== undefined)
    @IsNumber()
    @Expose({name: "max_uses"})
    maxUses?: number;

    @IsObject()
    @ValidateNested()
    config: CreateSignUpReferenceConfigRequest;
}
