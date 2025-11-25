export interface Transaction {
  txid: string;
  blockHeight: number;
  amount: number;
  timestamp: number;
  from: string[];
  to: string[];
  status: 'confirmed' | 'pending' | 'failed';
  type: 'mint' | 'burn' | 'transfer';
  age: string;
  fee: {
    mneeFee: number;
    minerFee: number;
    utxoBuildCost: number;
    transferCost: number;
  };
  confirmations: number;
  timeBetweenTx?: number;
}

export interface TransactionFilters {
  type: 'all' | 'mint' | 'burn' | 'transfer';
  amountRange: {
    min: number | null;
    max: number | null;
  };
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
}
