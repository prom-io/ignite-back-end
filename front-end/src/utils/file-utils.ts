const getExtension = require("file-extension");

export const convertToBase64 = (blob: Blob): Promise<string> => new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(blob);
    fileReader.onload = () => resolve(fileReader.result as string);
    fileReader.onerror = error => reject(error);
});

export const removeBase64Header = (base64String: string): string => base64String.substring(base64String.indexOf(";base64,") + ";base64,".length);

export const getFileExtensionFromName = (fileName: string): string => getExtension(fileName) as string;
