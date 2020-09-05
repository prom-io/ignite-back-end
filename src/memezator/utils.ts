import momentTZ from "moment-timezone"

/**
 * Cron with this expression will run every day at 00:00 in greenwich time
 */
export function getCronExpressionForMemezatorCompetitionSumminUpCron(): string {
  const lastMidnightInCetConvertedToLocalTime = momentTZ().tz("Europe/Berlin").hours(0).minutes(0).seconds(0).milliseconds(0).local()

  const cronExpression = `${lastMidnightInCetConvertedToLocalTime.minutes()} ${lastMidnightInCetConvertedToLocalTime.hours()} * * *`

  // tslint:disable-next-line: no-console
  console.log("getCronExpressionForMemezatorCompetitionSumminUpCron", {cronExpression, lastMidnightInCetConvertedToLocalTime})

  return cronExpression
}

/**
 * The memezator contest starts at midnight in CET, which is the midnight in Berlin. 
 */
export function getCurrentMemezatorContestStartTime(): momentTZ.Moment {
  const lastMidnightInCet = momentTZ().tz("Europe/Berlin").hours(0).minutes(0).seconds(0).milliseconds(0)

  return lastMidnightInCet
}
