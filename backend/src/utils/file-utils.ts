import {lookup} from "mime-types";

export const isImage = (fileExtension: string): boolean => {
    const mime = lookup(fileExtension);

    return typeof mime === "string" && mime.startsWith("image");
};
