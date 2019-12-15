export interface UploadDataResponse {
    id: string,
    price: number,
    storagePrice: number,
    duration: number,
    additional: {
        [key: string]: string
    }
}
