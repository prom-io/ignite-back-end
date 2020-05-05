import {Expose} from "class-transformer";

export class UserResponse {
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

    bio?: string;

    constructor(object: UserResponse) {
        Object.assign(this, object);
    }
}
