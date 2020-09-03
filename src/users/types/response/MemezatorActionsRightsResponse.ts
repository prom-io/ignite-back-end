import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";
import { Expose } from "class-transformer";

export enum CannotCreateMemeReasonCode {
    LIMIT_EXCEEDED = "LIMIT_EXCEEDED",
    DOESNT_HAVE_ENOUGH_POSTS = "DOESNT_HAVE_ENOUGH_POSTS",
    MISSING_AVATAR_OR_USERNAME_OR_BIO = "MISSING_AVATAR_OR_USERNAME_OR_BIO",

    /**
     * Когда в конкурсе уже участвуют определенное количество мемов (на данный момент лимит это 100 постов)
     * то больше никто не может создать мем, независимо от того они сегодня уже создали его или нет.
     */
    MEMES_LIMIT_EXCEEDED_FOR_CURRENT_CONTEST = "MEMES_LIMIT_EXCEEDED_FOR_CURRENT_CONTEST",

    /**
     * To create a meme user has to have a status created in the last 24 hours
     */
    DOESNT_HAVE_STATUS_CREATED_IN_LAST_24H = "DOESNT_HAVE_STATUS_CREATED_IN_LAST_24H",
}

export enum CannotVoteMemeReasonCode {
    LIMIT_EXCEEDED = "LIMIT_EXCEEDED"
}

export class MemezatorActionsRightsResponse {
    @ApiProperty({ name: "can_create" })
    @IsBoolean()
    @Expose({ name: "can_create" })
    canCreate: boolean;

    @ApiPropertyOptional({
        name: "cannot_create_reason_code",
        enum: CannotCreateMemeReasonCode,
        enumName: "CannotCreateMemeReasonCode",
    })
    @Expose({ name: "cannot_create_reason_code" })
    cannotCreateReasonCode?: CannotCreateMemeReasonCode;

    @ApiProperty({ name: "can_vote" })
    @IsBoolean()
    @Expose({ name: "can_vote" })
    canVote: boolean;
    
    @ApiPropertyOptional({
        name: "cannot_vote_reason_code",
        enum: CannotVoteMemeReasonCode,
        enumName: "CannotVoteMemeReasonCode",
    })
    @Expose({ name: "cannot_vote_reason_code" })
    cannotVoteReasonCode?: CannotVoteMemeReasonCode;

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
