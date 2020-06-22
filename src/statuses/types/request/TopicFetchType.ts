export enum TopicFetchType {
    HOT = "hot",
    FRESH = "fresh"
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
        default:
            return TopicFetchType.HOT;
    }
};
