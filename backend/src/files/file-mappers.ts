import {File} from "./types/entity";
import {FileResponse} from "./types/response";

export const fileToFileResponse = (file: File): FileResponse => ({
    id: file.id,
    createdAt: file.createdAt,
    extension: file.extension,
    fileMetadata: file.metadata,
    keepUntil: file.keepUntil,
    mimeType: file.mimeType,
    price: file.price,
    size: file.size
});
