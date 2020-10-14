import {Expose} from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserResponse {
    @ApiProperty()
    id: string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    acct: string;

    @ApiProperty({name: "display_name"})
    @Expose({name: "display_name"})
    displayName: string;
    @ApiProperty()
    remote: boolean;
    @ApiProperty()
    avatar: string;

    @ApiProperty({ name: "avatar_static" })
    @Expose({name: "avatar_static"})
    avatarStatic: string;

    @ApiProperty()
    header: string;

    @ApiProperty({ name: "header_static" })
    @Expose({name: "header_static"})
    headerStatic: string;

    @ApiProperty({ name: "followers_count" })
    @Expose({name: "created_at"})
    createdAt: string;

    @ApiProperty({ name: "followers_count" })
    @Expose({name: "followers_count"})
    followersCount: number;

    @ApiProperty({ name: "follows_count" })
    @Expose({name: "follows_count"})
    followingCount: number;

    @ApiProperty({ name: "statuses_count" })
    @Expose({name: "statuses_count"})
    statusesCount: number;

    @ApiProperty({ type: [String] })
    emojis: string[] = [];
    @ApiProperty()
    note: string = "";
    @ApiProperty({ type: [String] })
    fields: string[] = [];

    @ApiProperty()
    following: boolean;

    @ApiProperty({ name: "followed_by" })
    @Expose({name: "followed_by"})
    followedBy: boolean;

    @ApiPropertyOptional({ name: "password_hash" })
    @Expose({name: "password_hash"})
    passwordHash = undefined;

    @ApiPropertyOptional()
    bio?: string;

    @ApiPropertyOptional({ name: "external_url" })
    @Expose({name: "external_url"})
    externalUrl?: string;

    /**
     * @todo убрать, после того как фронт избавится от его использования
     */
    @ApiProperty({ name: "user_balance", example: "100", deprecated: true })
    @Expose({name: "user_balance"})
    userBalance: string;

    @ApiPropertyOptional({ name: "blockchain_balance", example: "100", description: `User's balance in Binance` })
    @Expose({name: "blockchain_balance"})
    blockchainBalance?: string;

    @ApiPropertyOptional({ name: "pending_rewards", example: "100", description: `The sum of pending rewards` })
    @Expose({name: "pending_rewards_sum"})
    pendingRewardsSum?: string;

    @ApiPropertyOptional({ name: "overall_balance", example: "100", description: `The overall balance. The sum of the balance in Binance and pending rewards` })
    @Expose({name: "overall_balance"})
    overallBalance?: string;

    @ApiProperty({ name: "voting_power", description: "Вес голоса в Memezator" })
    @Expose({name: "voting_power"})
    votingPower: number;

    constructor(object: UserResponse) {
        Object.assign(this, object);
    }
}
