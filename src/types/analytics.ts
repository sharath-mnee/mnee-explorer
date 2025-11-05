export interface GeneralInfo {
  totalSupply: number;
  holderCount: number;
  currentPrice: number;
  marketCap: number;
  fullyDilutedValue: number;
  pegDeviation: number;
  totalBurned: number;
  mneeV2ResponseTime: {
    '1': ResponseTimeMetrics;
    '7': ResponseTimeMetrics;
    '30': ResponseTimeMetrics;
    '6M': ResponseTimeMetrics;
    'all': ResponseTimeMetrics;
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


export type Timeframe = '1' | '7' | '30' | '6M' | 'all';

export interface TimeframeMetrics {
  transactionVolume: number;
  transactionCount: number;
  activeAddresses: number;
  mintActivity: number;
  burnActivity: number;
  avgTransactionFee: number;
  avgMneeTransferred: number;
}

export interface DashboardMetrics {
  '1': TimeframeMetrics;
  '7': TimeframeMetrics;
  '30': TimeframeMetrics;
  '6M': TimeframeMetrics;
  'all': TimeframeMetrics;
}

export interface ResponseTimeMetrics {
  avg: number;
  min: number;
  max: number;
}