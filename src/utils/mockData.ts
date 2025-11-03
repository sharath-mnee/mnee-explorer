import type { Transaction } from '@/types/transaction';
import type { Block } from '@/types/block';
import type { Address } from '@/types/address';
import type { Holder } from '@/types/holder';
import type { DashboardMetrics, GeneralInfo, ChartDataPoint } from '@/types/analytics';

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
      timestamp: now - (i * 600000),
      totalMneeTransferred: totalTransferred,
      transactionCount: txCount,
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

export const generateDashboardMetrics = (): DashboardMetrics => {
  return {
    transactionVolume24h: Math.random() * 10000000 + 1000000,
    transactionCount24h: Math.floor(Math.random() * 5000) + 1000,
    activeAddresses24h: Math.floor(Math.random() * 1000) + 200,
    mintActivity24h: Math.random() * 100000 + 10000,
    burnActivity24h: Math.random() * 50000 + 5000,
    avgTransactionFee: Math.random() * 0.01 + 0.001,
    avgMneeTransferred: Math.random() * 1000 + 100,
  };
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
      avg: Math.random() * 100 + 50,
      min: Math.random() * 50 + 20,
      max: Math.random() * 200 + 100,
    },
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
