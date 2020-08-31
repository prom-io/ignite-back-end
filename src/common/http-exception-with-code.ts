import { HttpException } from "@nestjs/common";

export class HttpExceptionWithCode extends HttpException {
  constructor(response: string | object, statusCode: number, code: string) {
    if (typeof response === "string") {
      super({ message: response, statusCode, code}, statusCode)
    } else {
      super({...response, code}, statusCode)
    }
  }
}
