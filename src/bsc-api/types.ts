export interface TokenTransfer {
  hash: string,
  from: string,
  to: string,
  amount: string,
  tokenSymbol: string,
  date: Date,
  blockNumber: number,
}

export interface TokenTransfersResult {
  tokenContractAddress: string,
  nextPageCursor?: string | undefined,
  tokenTransfers: TokenTransfer[],
}
