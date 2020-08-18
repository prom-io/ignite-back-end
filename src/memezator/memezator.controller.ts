import { Controller, Post } from "@nestjs/common";
import { MemezatorService } from "./memezator.service";

@Controller("api/v1/memezator")
export class MemezatorController {
  constructor(
    private readonly memezatorService: MemezatorService,
  ) {}

  @Post("start-competition-summing-up")
  public startCompetitionSummingUp() {
    return this.memezatorService.startMemezatorCompetitionSummingUp()
  }
}
