import { IsString, IsOptional, IsInt, IsPositive, ValidateIf, IsIn, Min } from "class-validator";
import { SafeTransformToInt } from "../../../utils/validation/safe-transform-to-int.decorator";
import { Language } from "../../entities";
import { FollowRecommendationFilters } from "./FollowRecommendationFilters";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UsersSearchFilters {
  @ApiPropertyOptional({ description: "Строка поиска" })
  @IsString()
  @IsOptional()
  q?: string

  @ApiPropertyOptional({ description: "Пагинация: сколько пропустить" })
  @SafeTransformToInt()
  @IsInt()
  @Min(0)
  @IsOptional()
  skip?: number

  @ApiPropertyOptional({ description: "Пагинация: сколько взять" })
  @SafeTransformToInt()
  @IsInt()
  @IsPositive()
  @IsOptional()
  take?: number

  @ValidateIf((object: FollowRecommendationFilters) => Boolean(object.language))
  @IsIn([Language.ENGLISH, Language.KOREAN, "kr"])
  language?: Language
}
