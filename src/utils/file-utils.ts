import {lookup} from "mime-types";
import fileSystem, { PathLike } from "fs"

export const isImage = (fileExtension: string): boolean => {
    const mime = lookup(fileExtension);

    return typeof mime === "string" && mime.startsWith("image");
};

export const exists = (path: PathLike): Promise<boolean> => {
    return fileSystem.promises.stat(path).then(() => true).catch(() => false)
}
