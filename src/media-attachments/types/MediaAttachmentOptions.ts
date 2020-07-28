import { Transform } from "class-transformer"
import { IsInt, IsOptional, IsPositive } from "class-validator"

export class MediaAttachmentOptions {
  @Transform(v => v === "" || v === null || v === undefined ? null : parseInt(v, 10))
  @IsInt()
  @IsPositive()
  @IsOptional()
  size?: number
}
