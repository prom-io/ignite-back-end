import { Controller, Post, Get, Body, UseGuards, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AdminGuard } from "../jwt-auth/AdminGuard";
import { RequiresAdmin } from "../jwt-auth/RequiresAdmin";
import { MemezatorService } from "./memezator.service";

@Controller("api/v1/memezator")
export class MemezatorController {
  constructor(
    private readonly memezatorService: MemezatorService,
  ) {}

  @Post("start-competition-summing-up")
  @UseGuards(AuthGuard("jwt"), AdminGuard)
  @RequiresAdmin()
  public startCompetitionSummingUp(
    @Body("startedInCron") startedInCronRaw?: any,
  ) {
    const startedInCron = typeof startedInCronRaw === "boolean" ?  startedInCronRaw : false;
    return this.memezatorService.startMemezatorCompetitionSummingUp({ startedInCron, dryRun: false });
  }

  @Get("dry-run-competition-summing-up")
  @UseGuards(AuthGuard("jwt"), AdminGuard)
  @RequiresAdmin()
  public dryRunCompetitionSummingUp(
    @Query("startedInCron") startedInCronRaw?: any,
    @Query("saveResultsInDryRun") saveResultsInDryRunRaw?: any,
  ) {
    const startedInCron = startedInCronRaw === "true" ? true : false;
    const saveResultsInDryRun = saveResultsInDryRunRaw === "true" ? true : false;
    return this.memezatorService.startMemezatorCompetitionSummingUp({ startedInCron, dryRun: true, saveResultsInDryRun })
  }
}
