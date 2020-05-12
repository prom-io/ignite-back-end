import {Expose} from "class-transformer";

export class RelationshipsResponse {
    id: string;
    following: boolean;

    @Expose({name: "showing_reblogs"})
    showingReblogs: boolean = false;

    @Expose({name: "followed_by"})
    followedBy: boolean;
    blocking: boolean = false;

    @Expose({name: "blocked_by"})
    blockedBy: boolean = false;
    muting: boolean = false;

    @Expose({name: "muting_notifications"})
    mutingNotifications: boolean = false;
    requested: boolean = false;

    @Expose({name: "domain_blocking"})
    domainBlocking: boolean = false;
    endorsed: boolean = false;

    constructor(object: RelationshipsResponse) {
        Object.assign(this, object);
    }
}
