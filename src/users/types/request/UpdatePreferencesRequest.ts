import {Language} from "../../entities/Language";
import {IsIn, IsNotEmpty, IsString} from "class-validator";

export class UpdatePreferencesRequest {
    @IsString()
    @IsNotEmpty()
    @IsIn([Language.ENGLISH, Language.KOREAN])
    language: Language;
}
