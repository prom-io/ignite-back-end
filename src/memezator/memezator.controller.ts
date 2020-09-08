import { Controller, Post, Get, Body, Query } from "@nestjs/common";
import { MemezatorService } from "./memezator.service";
import { GetResultsForGivenRangeOfDatesOptions } from "./types/request/GetResultsForGivenRangeOfDatesOptions";
import momentTZ from "moment-timezone"

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

  @Get("calculate-memezator-contest-results-for-given-range-of-date")
  public calculateMemezatorContestResultsForGivenRangeOfDate(
    @Query() options: GetResultsForGivenRangeOfDatesOptions,
  ) {
    return this.memezatorService.calculateMemezatorContestResultsForGivenRangeOfDate(
      momentTZ(options.competitionStartDate).tz("Europe/Berlin"),
      momentTZ(options.competitionEndDate).tz("Europe/Berlin"),
      options.rewardPool,
    )
  }

  @Get("dry-run-competition-summing-up")
  public dryRunCompetitionSummingUp() {
    return this.memezatorService.startMemezatorCompetitionSummingUp({ startedInCron: false, dryRun: true })
  }

  @Post("perform-transactions")
  async performTransactions(
    @Body() transactionsPlainObjects: object[],
  ) {
    return this.memezatorService.createAndPerformTransactions(transactionsPlainObjects as any)
  }

}
