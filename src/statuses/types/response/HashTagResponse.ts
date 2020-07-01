import {Language} from "../../../users/entities";
import {Expose} from "class-transformer";

export class HashTagResponse {
    id: string;
    title: string;

    @Expose({name: "posts_count"})
    postsCount: number;
    language: Language;
    following: boolean;

    constructor(object: HashTagResponse) {
        Object.assign(this, object);
    }
}
