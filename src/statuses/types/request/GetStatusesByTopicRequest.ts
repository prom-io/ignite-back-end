import {IsIn, IsString, ValidateIf} from "class-validator";
import {Transform} from "class-transformer";
import {FeedCursors} from "./FeedCursors";
import {fromString, TopicFetchType} from "./TopicFetchType";
import {getLanguageFromString, Language} from "../../../users/entities";

export class GetStatusesByTopicRequest implements FeedCursors {
    @ValidateIf((object: GetStatusesByTopicRequest) => Boolean(object.language))
    @IsString()
    @IsIn([Language.ENGLISH, Language.KOREAN, "kr"])
    @Transform(value => {
        if (value) {
            return getLanguageFromString(value);
        } else {
            return undefined;
        }
    })
    language?: Language;

    @ValidateIf((object: GetStatusesByTopicRequest) => Boolean(object.type))
    @IsString()
    @IsIn([TopicFetchType.HOT, TopicFetchType.FRESH])
    @Transform(value => fromString(value))
    type: TopicFetchType;

    @ValidateIf((object: GetStatusesByTopicRequest) => Boolean(object.maxId))
    @IsString()
    maxId?: string;

    @ValidateIf((object: GetStatusesByTopicRequest) => Boolean(object.sinceId))
    @IsString()
    sinceId?: string;
}
