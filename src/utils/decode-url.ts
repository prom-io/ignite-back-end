export const decodeUrlEncodedObjectProperties = <Type extends object>(object: Type): Type => {
    const copy: Type = {...object};
    Object.keys(object).forEach(key => {
        if (typeof object[key] === "string") {
            copy[key] = decodeURIComponent(object[key]);
        }
    });
    return copy;
};
