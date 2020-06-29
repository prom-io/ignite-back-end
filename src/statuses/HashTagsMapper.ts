import {Injectable} from "@nestjs/common";
import {HashTag} from "./entities";
import {HashTagResponse} from "./types/response";

@Injectable()
export class HashTagsMapper {

    public toHashTagResponse(hashTag: HashTag): HashTagResponse {
        return new HashTagResponse({
            id: hashTag.id,
            following: false,
            language: hashTag.language,
            postsCount: hashTag.postsCount,
            title: hashTag.name
        })
    }
}
