import {File} from "../model/entity";
import {FileResponse} from "../model/api/response";

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
