import { Transform } from "class-transformer"
import { IsInt, IsOptional, IsPositive, Max } from "class-validator"

export class MediaAttachmentOptions {
  @Transform(v => v === "" || v === null || v === undefined ? null : parseInt(v, 10))
  @IsInt()
  @IsPositive()
  @Max(10000)
  @IsOptional()
  size?: number
}
