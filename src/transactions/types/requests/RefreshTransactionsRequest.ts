import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class RefreshTransactionsRequest {
  @ApiProperty({ name: "address" })
  @IsString()
  @IsOptional()
  address: string
}