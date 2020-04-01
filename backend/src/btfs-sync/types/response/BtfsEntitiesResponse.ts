export interface BtfsEntitiesResponse {
    posts?: string[],
    likes?: Array<{
        commentId: string,
        id: string
    }>,
    images?: string[],
    subscribes?: Array<{
        userId: string,
        id: string
    }>
}
