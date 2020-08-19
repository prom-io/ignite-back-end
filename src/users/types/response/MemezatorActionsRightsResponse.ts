import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsIn } from "class-validator";
import { Expose } from "class-transformer";

export enum UserMemeActionsRightsReasonCode {
    LIMIT_EXCEEDED = "LIMIT_EXCEEDED"
}

export class MemezatorActionsRightsResponse {
    @ApiProperty({ name: "can_create" })
    @IsBoolean()
    @Expose({ name: "can_create" })
    canCreate: boolean;

    @ApiPropertyOptional({ name: "cannot_create_reason_code" })
    @Expose({ name: "cannot_create_reason_code" })
    cannotCreateReasonCode?: UserMemeActionsRightsReasonCode.LIMIT_EXCEEDED | null

    @ApiProperty({ name: "can_vote" })
    @IsBoolean()
    @Expose({ name: "can_vote" })
    canVote: boolean;
    
    @ApiPropertyOptional({
        name: "cannot_vote_reason_code",
        enum: UserMemeActionsRightsReasonCode
    })
    @Expose({ name: "cannot_vote_reason_code" })
    cannotVoteReasonCode?: UserMemeActionsRightsReasonCode.LIMIT_EXCEEDED | null;

    @ApiProperty({ name: "voting_power", description: "Вес голоса в голосовании Memezator-а" })
    @Expose({ name: "voting_power" })
    votingPower: number;

    @ApiProperty({
        name: "eth_prom_tokens",
        description: "Account balance in Ethereum. Note: this is string, not a number."
    })
    @Expose({ name: "eth_prom_tokens" })
    ethPromTokens: string

    constructor(data: MemezatorActionsRightsResponse) {
        Object.assign(this, data)
    }
}
