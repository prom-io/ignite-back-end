/**
 * Cron with this expression will run every day at 00:00 in greenwich time
 */
export function getCronExpressionForMemezatorCompetitionSumminUpCron(): string {
  const midnightInGreenwich = new Date()
  midnightInGreenwich.setUTCHours(0, 1, 0, 0)

  return `${midnightInGreenwich.getMinutes()} ${midnightInGreenwich.getHours()} * * *`
}
