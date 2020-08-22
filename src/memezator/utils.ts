/**
 * Cron with this expression will run every day at 00:00 in greenwich time
 */
export function getCronExpressionForMemezatorCompetitionSumminUpCron(): string {
  const midnightInGreenwich = new Date()
  midnightInGreenwich.setUTCHours(0, 50, 0, 0)

  const cronExpression = `${midnightInGreenwich.getMinutes()} ${midnightInGreenwich.getHours()} * * *`
  console.log({ cronExpression })
  return cronExpression
}

export function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}
