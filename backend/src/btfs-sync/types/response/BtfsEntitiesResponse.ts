export interface BtfsEntitiesResponse {
    posts: string[],
    likes: Array<{
        postId: string,
        id: string
    }>,
    images: string[],
    subscribes: Array<{
        userId: string,
        id: string
    }>
}
