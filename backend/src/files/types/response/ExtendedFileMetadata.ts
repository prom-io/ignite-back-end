import {FileMetadata} from "../../../model/entity";

export type ExtendedFileMetadata = FileMetadata & {[key: string]: string};
