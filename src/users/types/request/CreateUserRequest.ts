export interface CreateUserRequest {
    address: string,
    privateKey: string,
    isCommunity: boolean
    username?: string,
    displayedName?: string,
}
