export interface UploadDataResponse {
    id: string,
    price: number,
    duration: number,
    additional: {
        [key: string]: string
    }
}
