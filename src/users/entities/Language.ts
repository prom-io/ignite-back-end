export enum Language {
    ENGLISH = "en",
    KOREAN = "ko"
}

export const parseLanguageFromString = (language?: string): Language => {
    if (!language) {
        return Language.ENGLISH;
    }

    switch (language.toLowerCase().trim()) {
        case "en":
            return Language.ENGLISH;
        case "ko":
            return Language.KOREAN;
        default:
            return Language.ENGLISH;
    }
};
