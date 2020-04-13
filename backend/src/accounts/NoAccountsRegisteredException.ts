import {HttpException, HttpStatus} from "@nestjs/common";

export class NoAccountsRegisteredException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
