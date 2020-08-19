import { Controller, Post, Get } from "@nestjs/common";
import { MemezatorService } from "./memezator.service";

@Controller("api/v1/memezator")
export class MemezatorController {
  constructor(
    private readonly memezatorService: MemezatorService,
  ) {}

  @Post("start-competition-summing-up")
  public startCompetitionSummingUp() {
    return this.memezatorService.startMemezatorCompetitionSummingUp({ startedInCron: false, dryRun: false })
  }

  @Get("dry-run-competition-summing-up")
  public dryRunCompetitionSummingUp() {
    return this.memezatorService.startMemezatorCompetitionSummingUp({ startedInCron: false, dryRun: true })
  }

}
