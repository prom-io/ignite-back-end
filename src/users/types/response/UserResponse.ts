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

    @ApiProperty({ name: "user_balance", example: "100" })
    @Expose({name: "user_balance"})
    userBalance: string;

    @ApiProperty({ name: "voting_power", description: "Вес голоса в Memezator" })
    @Expose({name: "voting_power"})
    votingPower: number;

    @ApiProperty({name: "is_community"})
    @Expose({name: "is_communtiy"})
    isCommunity: boolean

    constructor(object: UserResponse) {
        Object.assign(this, object);
    }
}
