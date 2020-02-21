import {Expose} from "class-transformer";
import {UserResponse} from "../../../users/types/response";

export class StatusResponse {
    id: string;

    @Expose({name: "created_at"})
    createdAt: string;

    account: UserResponse;
    content: string;

    @Expose({name: "favourite_count"})
    favouritesCount: number;
    favourited: boolean;

    constructor(object: StatusResponse) {
        Object.assign(this, object);
    }
}
