export enum TransactionStatus {
  /**
   * The transaction with this status is only saved in
   * DB, but not really executed. So we didn't transfer
   * any money
   */
  NOT_STARTED = "NOT_STARTED",
  PERFORMING = "PERFORMING",
  PERFORMED = "PERFORMED",
  FAILED = "FAILED"
}
