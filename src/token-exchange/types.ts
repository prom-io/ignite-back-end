export interface BalanceResponse {
  status: string;
  balance: string;
}

export interface SendTokensParams {
  /**
   * приватный ключ отправителя
   */
  privateKeyFrom: string;

  /**
   * адрес получателя
   */
  addressTo: string;

  /**
   * количество токенов для перевода
   */
  amount: number;
}

export interface SendTokensResponse {
  status: string;
  /**
   * хэш транзакции перевода
   */
  result: string;
}
