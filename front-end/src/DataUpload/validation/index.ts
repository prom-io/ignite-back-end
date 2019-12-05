import {isStringEmpty} from "../../utils";

export const validateFileName = (name: string | undefined): string | undefined => {
    if (isStringEmpty(name)) {
        return "File name must be specified";
    }
};

export const validatePrice = (price: number | undefined): string | undefined => {
    if (price === undefined) {
        return "Price must be specified";
    }

    if (isNaN(price)) {
        return "Price must be a valid number";
    }

    if (price <= 0) {
        return "Price must be positive";
    }
};

export const validateMetaDataKey = (key?: string): string | undefined => {
    if (isStringEmpty(key)) {
        return "Metadata key is required";
    }
};

export const validateMetaDataValue = (value?: string): string | undefined => {
    if (isStringEmpty(value)) {
        return "Metadata value is required";
    }
};

export const validateData = (data?: string): string | undefined => {
    if (isStringEmpty(data)) {
        return "File must not be empty";
    }
};

export const validateAttachedFile = (file?: File): string | undefined => {
    if (file === undefined || file === null) {
        return "File is required";
    }
};
