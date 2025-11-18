import type { Transaction } from '@/types/transaction';
import type { Block } from '@/types/block';
import type { Address } from '@/types/address';
import type { Holder } from '@/types/holder';
import type { DashboardMetrics, GeneralInfo, ChartDataPoint, Timeframe, TimeframeMetrics, ResponseTimeMetrics} from '@/types/analytics';

const generateRandomAddress = (): string => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let address = '1';
  for (let i = 0; i < 33; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return address;
};

const generateRandomTxid = (): string => {
  const chars = '0123456789abcdef';
  let txid = '';
  for (let i = 0; i < 64; i++) {
    txid += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return txid;
};

const generateRandomHash = (): string => {
  return generateRandomTxid();
};

export const generateMockTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = Date.now();
  const types: Array<'mint' | 'burn' | 'transfer'> = ['mint', 'burn', 'transfer'];
  
  for (let i = 0; i < count; i++) {
    const timestamp = now - (i * 60000) - Math.random() * 300000;
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = Math.random() * 10000 + 10;
    
    transactions.push({
      txid: generateRandomTxid(),
      blockHeight: 800000 - i,
      amount,
      timestamp,
      from: [generateRandomAddress()],
      to: [generateRandomAddress()],
      status: i < count - 5 ? 'confirmed' : 'pending',
      type,
      fee: {
        mneeFee: Math.random() * 0.01,
        minerFee: Math.random() * 0.001,
        utxoBuildCost: Math.random() * 0.005,
        transferCost: Math.random() * 0.002,
      },
      confirmations: i < count - 5 ? Math.floor(Math.random() * 100) + 1 : 0,
      timeBetweenTx: i > 0 ? Math.random() * 120 : undefined,
    });
  }
  
  return transactions;
};

export const generateMockBlocks = (count: number): Block[] => {
  const blocks: Block[] = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const txCount = Math.floor(Math.random() * 11) + 5;
    const totalTransferred = Math.random() * 100000 + 1000;
    
    blocks.push({
      height: 800000 - i,
      hash: generateRandomHash(),
      timestamp: now - (i * 600000), // ~10 min per block
      totalMneeTransferred: totalTransferred,
      transactionCount: txCount,
      age: `${29 + i}m ${34 + i}s`,
      deltaTime: `${12 + (i % 10)}m ${26 + (i % 60)}s`,
      miner: ['SA100', 'CUVVE', 'GorillaPool.com', 'Mining-Dutch'][i % 4],
      averageFee: 0.00000121 + (i * 0.00000001),
      totalFee: 0.00318385 + (i * 0.0001),
      size: 2.21 + (i * 0.01),
      uniqueAddresses: Math.floor(txCount * 0.7),
      largestTransaction: Math.random() * 50000 + 1000,
      avgTransferVolume: totalTransferred / txCount,
      transactions: Array(txCount).fill(0).map(() => generateRandomTxid()),
    });
  }
  
  return blocks;
};

export const generateMockHolders = (count: number): Holder[] => {
  const holders: Holder[] = [];
  const totalSupply = 1000000000;
  let remainingSupply = totalSupply;
  
  for (let i = 0; i < count; i++) {
    const balance = remainingSupply * (Math.random() * 0.1 + 0.01);
    remainingSupply -= balance;
    
    holders.push({
      rank: i + 1,
      address: generateRandomAddress(),
      balance,
      percentageOfSupply: (balance / totalSupply) * 100,
      transactionCount: Math.floor(Math.random() * 1000) + 10,
    });
  }
  
  return holders.sort((a, b) => b.balance - a.balance);
};

export const generateGeneralInfo = (): GeneralInfo => {
  const totalSupply = 1000000000;
  const currentPrice = 0.998 + Math.random() * 0.004;
  
  return {
    totalSupply,
    holderCount: Math.floor(Math.random() * 10000) + 5000,
    currentPrice,
    marketCap: totalSupply * currentPrice,
    fullyDilutedValue: totalSupply * currentPrice,
    pegDeviation: ((currentPrice - 1) / 1) * 100,
    totalBurned: Math.random() * 10000000 + 1000000,
    mneeV2ResponseTime: {
      '1': generateResponseTimeMetrics('1'),
      '7': generateResponseTimeMetrics('7'),
      '30': generateResponseTimeMetrics('30'),
      '6M': generateResponseTimeMetrics('6M'),
      'all': generateResponseTimeMetrics('all'),
    },
  };
};

export const generateResponseTimeMetrics = (timeframe: Timeframe): ResponseTimeMetrics => {
  const baseFactors = {
    '1': 1,
    '7': 1.05,
    '30': 1.1,
    '6M': 1.15,
    'all': 1.2
  };

  const factor = baseFactors[timeframe];

  const avg = (Math.random() * 100 + 50) * factor;
  const min = (Math.random() * 30 + 20) * factor;
  const max = (Math.random() * 200 + 100) * factor;

  return {
    avg: Math.round(avg * 10) / 10,
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
  };
};

export const generateChartData = (days: number, baseValue: number, variance: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const now = Date.now();
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    const value = baseValue + (Math.random() - 0.5) * variance;
    
    data.push({
      timestamp,
      value: Math.max(0, value),
    });
  }
  
  return data;
};

export const generateMockAddress = (address: string): Address => {
  const txCount = Math.floor(Math.random() * 100) + 10;
  const transactions = [];
  const now = Date.now();
  let runningBalance = Math.random() * 100000;
  
  for (let i = 0; i < txCount; i++) {
    const type = Math.random() > 0.5 ? 'in' : 'out';
    const amount = Math.random() * 1000;
    
    if (type === 'in') {
      runningBalance += amount;
    } else {
      runningBalance -= amount;
    }
    
    transactions.push({
      txid: generateRandomTxid(),
      type: type as 'in' | 'out',
      amount,
      timestamp: now - (i * 3600000),
      runningBalance: Math.max(0, runningBalance),
      counterparty: generateRandomAddress(),
    });
  }
  
  const totalReceived = transactions
    .filter(tx => tx.type === 'in')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalSent = transactions
    .filter(tx => tx.type === 'out')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  return {
    address,
    balance: runningBalance,
    firstSeen: now - (txCount * 3600000),
    lastActivity: now,
    transactionCount: txCount,
    totalSent,
    totalReceived,
    transactions,
  };
};

export const generateTimeframeMetrics = (timeframe: Timeframe): TimeframeMetrics => {
  // Base multipliers for different timeframes
  const multipliers = {
    '1': 1,
    '7': 7,
    '30': 30,
    '6M': 180,
    'all': 365
  };

  const multiplier = multipliers[timeframe];

  return {
    transactionVolume: Math.random() * 10000000 * multiplier + 1000000,
    transactionCount: Math.floor(Math.random() * 5000 * multiplier) + 1000,
    activeAddresses: Math.floor(Math.random() * 1000 * Math.sqrt(multiplier)) + 200,
    mintActivity: Math.random() * 100000 * multiplier + 10000,
    burnActivity: Math.random() * 50000 * multiplier + 5000,
    avgTransactionFee: Math.random() * 0.01 + 0.001,
    avgMneeTransferred: Math.random() * 1000 + 100,
  };
};

export const generateDashboardMetrics = (): DashboardMetrics => {
  return {
    '1': generateTimeframeMetrics('1'),
    '7': generateTimeframeMetrics('7'),
    '30': generateTimeframeMetrics('30'),
    '6M': generateTimeframeMetrics('6M'),
    'all': generateTimeframeMetrics('all'),
  };
};