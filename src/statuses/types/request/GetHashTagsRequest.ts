import {IsIn, IsNumber, IsPositive, IsString, ValidateIf} from "class-validator";
import {Transform} from "class-transformer";
import {getLanguageFromString, Language} from "../../../users/entities";

export class GetHashTagsRequest {
    @ValidateIf((object: GetHashTagsRequest) => Boolean(object.language))
    @IsString()
    @IsIn([Language.KOREAN, Language.ENGLISH, "kr"])
    @Transform(value => {
        if (value) {
            return getLanguageFromString(value);
        }

        return undefined;
    })
    language?: Language;

    @ValidateIf((object: GetHashTagsRequest) => object.count !== null && object.count !== undefined)
    @IsNumber()
    @IsPositive()
    @Transform(value => {
        if (value === null || value === undefined) {
            return 5;
        }

        if (!isNaN(Number(value))) {
            return Number(value)
        }

        return value;
    })
    count: number;
}
