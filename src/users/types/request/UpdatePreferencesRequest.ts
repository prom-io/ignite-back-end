import {IsIn, IsNotEmpty, IsString} from "class-validator";
import {Transform} from "class-transformer";
import {getLanguageFromString, Language} from "../../entities";

export class UpdatePreferencesRequest {
    @IsString()
    @IsNotEmpty()
    @Transform(value => getLanguageFromString(value as string))
    @IsIn([Language.ENGLISH, Language.KOREAN, "kr"])
    language: Language;
}
