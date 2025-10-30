export interface Address {
  address: string;
  balance: number;
  firstSeen: number;
  lastActivity: number;
  transactionCount: number;
  totalSent: number;
  totalReceived: number;
  transactions: AddressTransaction[];
}

export interface AddressTransaction {
  txid: string;
  type: 'in' | 'out';
  amount: number;
  timestamp: number;
  runningBalance: number;
  counterparty: string;
}

export interface TopCounterparty {
  address: string;
  transactionCount: number;
  totalVolume: number;
}
