export enum TopicFetchType {
    HOT = "hot",
    FRESH = "fresh",
    MEMES = "memes"
}

export const fromString = (topicFetchTypeString?: string): TopicFetchType => {
    if (!topicFetchTypeString) {
        return TopicFetchType.HOT;
    }

    switch (topicFetchTypeString.toLowerCase().trim()) {
        case "hot":
            return TopicFetchType.HOT;
        case "fresh":
            return TopicFetchType.FRESH;
            case "memes":
                return TopicFetchType.MEMES;
        default:
            return TopicFetchType.HOT;
    }
};
