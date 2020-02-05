import {FileMetadata} from "../entity";

export type ExtendedFileMetadata = FileMetadata & {[key: string]: string};
