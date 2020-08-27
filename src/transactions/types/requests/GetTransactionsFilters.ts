import { ApiPropertyOptional } from "@nestjs/swagger"
import { SafeTransformToInt } from "../../../utils/validation/safe-transform-to-int.decorator"
import { IsInt, IsPositive, IsOptional, Min, IsString, IsEnum } from "class-validator"
import { Expose } from "class-transformer"
import { TransactionStatus } from "../TransactionStatus.enum"

export class GetTransactionsFilters {
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

  @ApiPropertyOptional({ name: "txn_name" })
  @IsString()
  @IsOptional()
  @Expose({ name: "txn_name" })
  txnHash?: string

  @ApiPropertyOptional({ name: "txn_status", enum: TransactionStatus, enumName: "TransactionStatus" })
  @IsEnum(TransactionStatus)
  @IsOptional()
  @Expose({ name: "txn_status" })
  txnStatus?: TransactionStatus
}
