import momentTZ from "moment-timezone"

/**
 * Cron with this expression will run every day at 00:00 in greenwich time
 */
export function getCronExpressionForMemezatorCompetitionSumminUpCron(): string {
  const midnightInCET = new Date()
  midnightInCET.setUTCHours(-2, 1, 0, 0)

  return `${midnightInCET.getMinutes()} ${midnightInCET.getHours()} * * *`
}

/**
 * The memezator contest starts at midnight in CET, which is the midnight in Berlin. 
 */
export function getLastMemezatorContestStartTime() {
  const lastMidnightInCet = momentTZ().tz("Europe/Berlin").hours(0).minutes(0).seconds(0).milliseconds(0)

  return lastMidnightInCet
}
