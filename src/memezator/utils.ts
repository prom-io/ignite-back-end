/**
 * Cron with this expression will run every day at 00:00 in greenwich time
 */
export function getCronExpressionForMemezatorCompetitionSumminUpCron(): string {
  const midnightInCET = new Date()
  midnightInCET.setUTCHours(-2, 1, 0, 0)

  return `${midnightInCET.getMinutes()} ${midnightInCET.getHours()} * * *`
}
