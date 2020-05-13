export interface BtfsStatusEntityResponse {
    peerIp: string,
    postId: string,
    peerWallet: string
}

export interface BtfsImageEntityResponse {
    fileId: string,
    peerIp: string,
    peerWallet: string
}

export interface BtfsStatusLikeEntityResponse {
    commentId: string,
    id: string,
    peerWallet: string,
    peerIp: string
}

export interface BtfsUserEntityResponse {
    userId: string,
    peerIp: string,
    peerWallet: string
}

export interface BtfsUserSubscriptionEntityResponse {
    id: string,
    userId: string,
    peerIp: string,
    peerWallet: string
}

export interface BtfsCommentEntityResponse {
    commentId: string,
    postId: string,
    peerWallet: string,
    peerId: string
}

export interface BtfsEntitiesResponse {
    posts?: BtfsStatusEntityResponse[],
    likes?: BtfsStatusLikeEntityResponse[],
    images?: BtfsImageEntityResponse[],
    subscribes?: BtfsUserSubscriptionEntityResponse[],
    users?: BtfsUserEntityResponse[],
    unlikes?: BtfsStatusLikeEntityResponse[],
    unsubscribes?: BtfsUserSubscriptionEntityResponse[],
    comments?: BtfsCommentEntityResponse[]
}
