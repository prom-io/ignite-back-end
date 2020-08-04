import { IsString, IsOptional, IsInt, IsPositive, ValidateIf, IsIn } from "class-validator";
import { SafeTransformToInt } from "../../../utils/validation/safe-transform-to-int.decorator";
import { Language } from "../../entities";
import { FollowRecommendationFilters } from "./FollowRecommendationFilters";

export class UsersSearchFilters {
  @IsString()
  @IsOptional()
  q?: string

  @SafeTransformToInt()
  @IsInt()
  @IsPositive()
  @IsOptional()
  skip?: number

  @SafeTransformToInt()
  @IsInt()
  @IsPositive()
  @IsOptional()
  take?: number

  @ValidateIf((object: FollowRecommendationFilters) => Boolean(object.language))
  @IsIn([Language.ENGLISH, Language.KOREAN, "kr"])
  language?: Language
}
