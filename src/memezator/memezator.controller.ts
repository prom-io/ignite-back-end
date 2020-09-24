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
  public dryRunCompetitionSummingUp() {
    return this.memezatorService.startMemezatorCompetitionSummingUp({ startedInCron: false, dryRun: true })
  }

  @Get("top-10-winners")
  public getWinnersByLIkes(
    @Query() date: Date
  ) {
    return this.memezatorService.getWinnersByLikes(date)
  }

}
