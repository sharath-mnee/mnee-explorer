export interface Block {
  height: number;
  hash: string;
  timestamp: number;
  totalMneeTransferred: number;
  age: string;
  deltaTime: string;
  miner: string;
  averageFee: number;
  totalFee: number;
  size: number;
  transactionCount: number;
  uniqueAddresses: number;
  largestTransaction: number;
  avgTransferVolume: number;
  transactions: string[]; // txids
}
