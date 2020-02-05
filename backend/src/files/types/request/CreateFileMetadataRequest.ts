import {IsString, IsArray, MaxLength} from "class-validator";

export class CreateFileMetadataRequest {
    @IsString({message: "Brief description must be a string"})
    @MaxLength(120, {message: "Brief description can include up to 120 characters"})
    public briefDescription?: string;

    @IsString({message: "Full description must be a string"})
    @MaxLength(120, {message: "Full description can include up to 120 characters"})
    public fullDescription?: string;

    @IsArray({message: "Hash tags must be represented as array"})
    @MaxLength(10, {message: "Hash tags can include up to 10 items"})
    public hashTags?: string[];

    @IsString({message: "Brief description must be a string"})
    @MaxLength(120, {message: "Brief description can include up to 120 characters"})
    public author?: string;

    @IsString({message: "User comment must be a string"})
    @MaxLength(120, {message: "User comment can include up to 120 characters"})
    public userComment?: string;

    constructor(briefDescription: string, fullDescription: string, hashTags: string[], author: string, userComment: string) {
        this.briefDescription = briefDescription;
        this.fullDescription = fullDescription;
        this.hashTags = hashTags;
        this.author = author;
        this.userComment = userComment;
    }
}
