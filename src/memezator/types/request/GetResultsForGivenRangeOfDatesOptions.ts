import { Type } from "class-transformer";
import { IsInt, IsDate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetResultsForGivenRangeOfDatesOptions {
  @ApiProperty({ type: "string" })
  @Type(() => Date)
  @IsDate()
  competitionEndDate: Date;

  @ApiProperty({ type: "string" })
  @Type(() => Date)
  @IsDate()
  competitionStartDate: Date;
  
  @ApiProperty({ type: "number" })
  @Type(() => Number)
  @IsInt()
  rewardPool: number;
}
