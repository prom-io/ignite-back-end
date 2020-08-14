import {IsBoolean, IsIn, IsOptional, IsString, ValidateIf} from "class-validator";
import {Expose, Transform} from "class-transformer";
import {FeedCursors} from "./FeedCursors";
import {fromString, TopicFetchType} from "./TopicFetchType";
import {Language} from "../../../users/entities";

export class GetStatusesRequest implements FeedCursors {
    @IsOptional()
    @IsString()
    @Expose({name: "since_id"})
    sinceId?: string;

    @IsOptional()
    @IsString()
    @Expose({name: "max_id"})
    maxId?: string;

    @ValidateIf((object: GetStatusesRequest) => Boolean(object.language))
    @IsString()
    @IsIn([Language.ENGLISH, Language.KOREAN, "kr"])
    language?: Language;

    @IsBoolean()
    @Transform(value => Boolean(value))
    @Expose({name: "only_with_hash_tags"})
    onlyWithHashTags: boolean;

    @ValidateIf((object: GetStatusesRequest) => Boolean(object.type))
    @IsString()
    @IsIn([TopicFetchType.HOT, TopicFetchType.FRESH, TopicFetchType.MEMES])
    @Transform(value => fromString(value))
    type: TopicFetchType;
}
