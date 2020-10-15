import { transactionDirection } from './../../TransactionDirection';
import { TransactionStatus } from "../TransactionStatus.enum"
import { TransactionSubject } from "../TransactionSubject.enum"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class TransactionResponse {
  @ApiProperty()
  id: string;

  @ApiProperty({ name: "created_at", type: "string", format: "datetime" })
  @Expose({ name: "created_at" })
  createdAt: Date;

  @ApiPropertyOptional({ name: "txn_hash" })
  @Expose({ name: "txn_hash" })
  txnHash?: string;

  @ApiPropertyOptional({ name: "txn_date", type: "string", format: "datetime" })
  @Expose({ name: "txn_date" })
  txnDate?: Date;

  @ApiProperty({ name: "txn_status", enum: TransactionStatus })
  @Expose({ name: "txn_status" })
  txnStatus: TransactionStatus;

  @ApiProperty({ name: "txn_from" })
  @Expose({ name: "txn_from" })
  txnFrom: string;

  @ApiProperty({ name: "txn_to" })
  @Expose({ name: "txn_to" })
  txnTo: string;

  @ApiProperty({ name: "txn_sum" })
  @Expose({ name: "txn_sum" })
  txnSum: string;

  @ApiProperty({ name: "txn_subject", enum: TransactionSubject })
  @Expose({ name: "txn_subject" })
  txnSubj: TransactionSubject;

  @ApiProperty({ name: "txn_details" })
  @Expose({ name: "txn_details" })
  txnDetails: object;

  @ApiPropertyOptional({
    name: "txn_direction", enum: transactionDirection, enumName: "transactionDirection",
    description: "Показывает направление перевода. Возможные значения: OUT/IN"
  })
  @Expose({ name: "txn_direction" })
  txnDirection?: transactionDirection

  @ApiPropertyOptional()
  @Expose()
  ethereumAddress?: string

  constructor(data: TransactionResponse) {
    Object.assign(this, data)
  }
}
