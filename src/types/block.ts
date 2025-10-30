export interface Block {
  height: number;
  hash: string;
  timestamp: number;
  totalMneeTransferred: number;
  transactionCount: number;
  uniqueAddresses: number;
  largestTransaction: number;
  avgTransferVolume: number;
  transactions: string[]; // txids
}
