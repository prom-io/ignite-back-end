export enum Language {
    ENGLISH = "en",
    KOREAN = "ko"
}

export const getLanguageFromString = (language?: string): Language => {
    if (!language) {
        return Language.ENGLISH;
    }

    switch (language.toLowerCase().trim()) {
        case "en":
            return Language.ENGLISH;
        case "ko":
        case "kr":
            return Language.KOREAN;
        default:
            return Language.ENGLISH;
    }
};
