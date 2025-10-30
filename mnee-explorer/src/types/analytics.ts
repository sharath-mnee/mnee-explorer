export interface DashboardMetrics {
  transactionVolume24h: number;
  transactionCount24h: number;
  activeAddresses24h: number;
  mintActivity24h: number;
  burnActivity24h: number;
  avgTransactionFee: number;
  avgMneeTransferred: number;
}

export interface GeneralInfo {
  totalSupply: number;
  holderCount: number;
  currentPrice: number;
  marketCap: number;
  fullyDilutedValue: number;
  pegDeviation: number;
  totalBurned: number;
  mneeV2ResponseTime: {
    avg: number;
    min: number;
    max: number;
  };
}

export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface AddressMetrics {
  newAddressesPerDay: ChartDataPoint[];
  activeAddressesPerDay: ChartDataPoint[];
  cumulativeAddressGrowth: ChartDataPoint[];
}

export interface NetworkMetrics {
  blockTimeTrends: ChartDataPoint[];
  blockProductionRate: ChartDataPoint[];
}

export interface TimeRange {
  label: string;
  days: number;
}
