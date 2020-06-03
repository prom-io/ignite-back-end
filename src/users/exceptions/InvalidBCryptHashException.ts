import {HttpException, HttpStatus} from "@nestjs/common";
import {Expose} from "class-transformer";

export class InvalidBCryptHashException extends HttpException {
    hash: string;

    constructor(hash: string) {
        super(
            `Provided hash ${hash} is not valid bcrypt hash`,
            HttpStatus.BAD_REQUEST
        );
        this.hash = hash;
    }
}
