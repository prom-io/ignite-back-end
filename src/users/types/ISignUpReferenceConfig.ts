export interface ISignUpReferenceConfig {
    accountsToSubscribe: string[];

    /**
     * Это ID пользователей, которых будем рекомендовать
     * для подписки. То есть показывать в блоке "Who to follow".
     * 
     * Сделаем опциональным, потому что это фича добавилась
     * позже, а сломать существующий функционал не хочется :)
     */
    accountsToRecommend?: string[];
}
