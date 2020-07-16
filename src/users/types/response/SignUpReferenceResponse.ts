import {Expose} from "class-transformer";
import {UserResponse} from "./UserResponse";
import {SignUpReferenceConfigResponse} from "./SignUpReferenceConfigResponse";

export class SignUpReferenceResponse {
    id: string;
    url: string;

    @Expose(({name: "created_by"}))
    createdBy: UserResponse;

    @Expose({name: "created_at"})
    createdAt: Date;

    @Expose({name: "expires_at"})
    expiresAt?: Date;

    @Expose({name: "registered_users_count"})
    registeredUsersCount: number;

    @Expose({name: "max_uses"})
    maxUses: number;

    config: SignUpReferenceConfigResponse;

    constructor(plainObject: SignUpReferenceResponse) {
        Object.assign(this, plainObject);
    }
}
