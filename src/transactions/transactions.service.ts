import { Injectable } from "@nestjs/common";
import { TransactionsRepository } from "./TransactionsRepository";

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}
}
