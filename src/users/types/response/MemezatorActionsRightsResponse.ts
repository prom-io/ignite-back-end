import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsIn } from "class-validator";

export enum UserMemeActionsRightsReasonCode {
    LIMIT_EXCEEDED = "LIMIT_EXCEEDED"
}

export class MemezatorActionsRightsResponse {
    @ApiProperty()
    @IsBoolean()
    can_create: boolean;

    @ApiPropertyOptional()
    cannot_create_reason_code?: UserMemeActionsRightsReasonCode.LIMIT_EXCEEDED | null

    @ApiProperty()
    @IsBoolean()
    can_vote: boolean;
    
    @ApiPropertyOptional({enum: UserMemeActionsRightsReasonCode})
    cannot_vote_reason_code?: UserMemeActionsRightsReasonCode.LIMIT_EXCEEDED | null 
}