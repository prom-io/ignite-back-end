import { Controller, Post, Get, Body } from "@nestjs/common";
import { MemezatorService } from "./memezator.service";

@Controller("api/v1/memezator")
export class MemezatorController {
  constructor(
    private readonly memezatorService: MemezatorService,
  ) {}

  @Post("start-competition-summing-up")
  public startCompetitionSummingUp(
    @Body("startedInCron") startedInCronRaw?: any,
  ) {
    const startedInCron = typeof startedInCronRaw === "boolean" ?  startedInCronRaw : false;
    return this.memezatorService.startMemezatorCompetitionSummingUp({ startedInCron, dryRun: false });
  }

  @Get("dry-run-competition-summing-up")
  public dryRunCompetitionSummingUp() {
    return this.memezatorService.startMemezatorCompetitionSummingUp({ startedInCron: false, dryRun: true })
  }

  @Get("get-winners-by-likes")
  public getWinnersByLIkes() {
    return this.memezatorService.getWinnersByLikes()
  }

}
