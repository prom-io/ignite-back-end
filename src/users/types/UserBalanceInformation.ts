export interface UserBalanceInformation {
  /**
   * баланс в бинансе
   */
  blockchainBalance: string;

  /**
   * сумма всех транзакций в статусе Pending (выплаты ревордов, еще не отправленные в блокчейне)
   */
  pendingRewardsSum: string;

  /**
   * Сумма баланса в бинансе и неотданных выигрышей, то есть:
   * overallBalance = blockchainBalance + pendingRewardsSum
   */
  overallBalance: string;
}
