import {Expose} from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserResponse {
    @ApiProperty()
    id: string;
    username: string;
    acct: string;

    @Expose({name: "display_name"})
    displayName: string;
    remote: boolean;
    avatar: string;

    @Expose({name: "avatar_static"})
    avatarStatic: string;

    header: string;

    @Expose({name: "header_static"})
    headerStatic: string;

    @Expose({name: "created_at"})
    createdAt: string;

    @Expose({name: "followers_count"})
    followersCount: number;

    @Expose({name: "follows_count"})
    followingCount: number;

    @Expose({name: "statuses_count"})
    statusesCount: number;

    emojis: string[] = [];
    note: string = "";
    fields: string[] = [];

    following: boolean;

    @Expose({name: "followed_by"})
    followedBy: boolean;

    @Expose({name: "password_hash"})
    passwordHash = undefined;

    bio?: string;

    @ApiPropertyOptional({ name: "external_url" })
    @Expose({name: "external_url"})
    externalUrl?: string;

    @ApiProperty()
    balance: string;

    @ApiProperty({ name: "memezator_vote_weight", description: "Вес голоса в Memezator" })
    @Expose({name: "memezator_vote_weight"})
    memezatorVoteWeight: number;

    constructor(object: UserResponse) {
        Object.assign(this, object);
    }
}
