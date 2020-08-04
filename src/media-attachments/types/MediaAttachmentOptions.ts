import { IsInt, IsOptional, IsPositive, Max } from "class-validator"
import { SafeTransformToInt } from "../../utils/validation/safe-transform-to-int.decorator"

export class MediaAttachmentOptions {
  @SafeTransformToInt()
  @IsInt()
  @IsPositive()
  @Max(10000)
  @IsOptional()
  size?: number
}
