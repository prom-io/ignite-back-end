import {IsIn, ValidateIf} from "class-validator";
import {Language} from "../../entities";
import {PaginationRequest} from "../../../utils/pagination";

export class FollowRecommendationFilters extends PaginationRequest {
    @ValidateIf((object: FollowRecommendationFilters) => Boolean(object.language))
    @IsIn([Language.ENGLISH, Language.KOREAN, "kr"])
    language?: Language
}
