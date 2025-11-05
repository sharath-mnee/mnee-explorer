import { useAppSelector } from '@/store/hooks';
import { StatCard } from '@/components/common/StasCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Flame, 
  DollarSign, 
  ArrowUpCircle,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { formatNumber, formatCurrency, formatMNEE } from '@/utils/formatters';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatTimeAgo, formatTxid, formatDuration } from '@/utils/formatters';
import type { Timeframe } from '@/types/analytics';
import { setQuery } from '@/store/slices/searchSlice';

// Updated StatCard with timeframe functionality
const StatCardWithTimeframe = ({ 
  title, 
  getValue, 
  getSubtitle, 
  icon, 
  className 
}: { 
  title: string;
  getValue: (timeframe: Timeframe) => string;
  getSubtitle?: (timeframe: Timeframe) => string;
  icon: any;
  className?: string;
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1');
  const [isHovered, setIsHovered] = useState(false);

  const timeframes: { value: Timeframe; label: string }[] = [
    { value: '1', label: '1D' },
    { value: '7', label: '7D' },
    { value: '30', label: '30D' },
    { value: '6M', label: '6M' },
    { value: 'all', label: 'All' }
  ];

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StatCard
        title={title}
        value={getValue(selectedTimeframe)}
        subtitle={getSubtitle?.(selectedTimeframe)}
        icon={icon}
        className={className}
      />
      
      {isHovered && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg shadow-lg z-20 px-2 py-2">
          <div className="flex items-center gap-1">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setSelectedTimeframe(tf.value)}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedTimeframe === tf.value
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-border"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-[7px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-popover"></div>
        </div>
      )}
    </div>
  );
};

const PerformanceMetricsCard = ({ generalInfo }: { generalInfo: any }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1');
  const [isHovered, setIsHovered] = useState(false);

  const timeframes: { value: Timeframe; label: string }[] = [
    { value: '1', label: '1D' },
    { value: '7', label: '7D' },
    { value: '30', label: '30D' },
    { value: '6M', label: '6M' },
    { value: 'all', label: 'All' }
  ];

  const currentMetrics =
    generalInfo?.mneeV2ResponseTime?.[selectedTimeframe] ??
    generalInfo?.mneeV2ResponseTime ??
    { avg: 0, min: 0, max: 0 };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="bg-gradient-to-br from-card/95 to-card/70 border-border/30 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-muted-foreground">
            Performance Metrics
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">MNEE V2 Response Time (Avg)</p>
            <p className="text-2xl font-bold">{formatDuration(currentMetrics.avg)}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Response Time (Min / Max)</p>
            <p className="text-lg font-semibold">
              {formatDuration(currentMetrics.min)} / {formatDuration(currentMetrics.max)}
            </p>
          </div>
        </CardContent>
      </Card>

      {isHovered && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg shadow-lg z-20 px-1.5 py-1.5">
          <div className="flex items-center gap-1">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setSelectedTimeframe(tf.value)}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedTimeframe === tf.value
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-border"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-[7px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-popover"></div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { dashboardMetrics, generalInfo } = useAppSelector((state) => state.analytics);
  const transactions = useAppSelector((state) => state.transactions.list);
  const recentTransactions = transactions.slice(0, 10);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchInput, setSearchInput] = useState('');

  // Helper functions to get values for different timeframes
  const getTransactionVolume = (timeframe: Timeframe) => 
    formatCurrency(dashboardMetrics[timeframe].transactionVolume, 0);
  
  const getTransactionSubtitle = (timeframe: Timeframe) => 
    `${formatNumber(dashboardMetrics[timeframe].transactionCount)} transactions`;
  
  const getActiveAddresses = (timeframe: Timeframe) => 
    formatNumber(dashboardMetrics[timeframe].activeAddresses, 0);
  
  const getMintActivity = (timeframe: Timeframe) => 
    formatMNEE(dashboardMetrics[timeframe].mintActivity, 0);
  
  const getBurnActivity = (timeframe: Timeframe) => 
    formatMNEE(dashboardMetrics[timeframe].burnActivity, 0);
  
  const getAvgTransactionFee = (timeframe: Timeframe) => 
    formatMNEE(dashboardMetrics[timeframe].avgTransactionFee, 4);
  
  const getAvgMneeTransferred = (timeframe: Timeframe) => 
    formatMNEE(dashboardMetrics[timeframe].avgMneeTransferred, 2);

  // Mock chart data
  const volumeData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    volume: Math.random() * 5000 + 20000,
  }));

  const supplyData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    supply: 10000 + i * 1000,
  }));

  const avgTxData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    avg: Math.random() * 1000 + 200,
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      dispatch(setQuery(searchInput));
      
      // Simple routing based on input
      if (searchInput.length === 64) {
        navigate(`/tx/${searchInput}`);
      } else if (searchInput.length === 34) {
        navigate(`/address/${searchInput}`);
      } else if (!isNaN(Number(searchInput))) {
        navigate(`/block/${searchInput}`);
      } else {
        navigate('/transactions');
      }
    }
  };

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Section - unchanged */}
      <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-orange-950/30 rounded-2xl p-8 border border-amber-200 dark:border-amber-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">MNEE Explorer</h1>
              <p className="text-muted-foreground">Real-time analytics for MNEE network</p>
            </div>
          </div>
          <form onSubmit={handleSearch} className="hidden md:block relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by Address / Txn Hash / Block"
              className="w-[500px] h-12 pl-12 text-base"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </div>
      </div>

      {/* 24h Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Overview</h2>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-card/95 to-card/70 border-border/30 shadow-md">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-muted-foreground">
                Network Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col justify-between">
                <StatCardWithTimeframe
                  title="Transaction Volume"
                  getValue={getTransactionVolume}
                  getSubtitle={getTransactionSubtitle}
                  icon={TrendingUp}
                  className="bg-transparent shadow-none border-none h-full flex flex-col justify-center"
                />
              </div>

              <div className="flex flex-col justify-between">
                <StatCardWithTimeframe
                  title="Active Addresses"
                  getValue={getActiveAddresses}
                  getSubtitle={() => "Unique addresses"}
                  icon={Users}
                  className="bg-transparent shadow-none border-none h-full flex flex-col justify-center"
                />
              </div>
            </CardContent>
          </Card>

          {/* Mint & Burn Activity */}
          <Card className="bg-gradient-to-br from-card/95 to-card/70 border-border/30 shadow-md">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-muted-foreground">
                Token Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCardWithTimeframe
                title="Mint Activity"
                getValue={getMintActivity}
                getSubtitle={() => "New tokens minted"}
                icon={ArrowUpCircle}
                className="bg-transparent shadow-none border-none"
              />
              <StatCardWithTimeframe
                title="Burn Activity"
                getValue={getBurnActivity}
                getSubtitle={() => "Tokens burned"}
                icon={Flame}
                className="bg-transparent shadow-none border-none"
              />
            </CardContent>
          </Card>

          {/* Transaction Fee & MNEE Transferred */}
          <Card className="bg-gradient-to-br from-card/95 to-card/70 border-border/30 shadow-md">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-muted-foreground">
                Average Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCardWithTimeframe
                title="Avg Transaction Fee"
                getValue={getAvgTransactionFee}
                icon={DollarSign}
                className="bg-transparent shadow-none border-none"
              />
              <StatCardWithTimeframe
                title="Avg Transferred"
                getValue={getAvgMneeTransferred}
                icon={Activity}
                className="bg-transparent shadow-none border-none"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* General Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">General Information</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-card/95 to-card/70 border-border/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-muted-foreground">
                Token Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Supply</p>
                <p className="text-2xl font-bold">{generalInfo.totalSupply}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Market Cap</p>
                <p className="text-2xl font-bold">{formatCurrency(generalInfo.marketCap, 0)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">FDV</p>
                <p className="text-2xl font-bold">{formatCurrency(generalInfo.fullyDilutedValue, 0)}</p>
              </div>
            </CardContent>
          </Card>
          <PerformanceMetricsCard generalInfo={generalInfo} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Link to="/transactions" className="text-sm text-primary hover:underline">
              View all →
            </Link>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.txid}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-[88px] flex-shrink-0 text-center px-3 py-1.5 rounded text-xs font-medium tracking-wide ${
                        tx.type === "mint"
                          ? "bg-success/10 text-success"
                          : tx.type === "burn"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {tx.type.toUpperCase()}
                    </div>

                    <div>
                      <Link
                        to={`/tx/${tx.txid}`}
                        className="font-mono text-sm hover:text-primary"
                      >
                        {formatTxid(tx.txid)}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        Block #{tx.blockHeight}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">{formatMNEE(tx.amount, 2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(tx.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Side Charts */}
        <div className="space-y-6">
          {/* Transaction Volume Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume Over Time (30days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: number) => formatCurrency(value, 0)}
                  />
                  <Line type="monotone" dataKey="volume" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Supply Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Supply Growth (30 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={supplyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: number) => formatMNEE(value, 0)}
                  />
                  <Area type="monotone" dataKey="supply" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2) / 0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Average Transaction Value Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Average Transaction Value (30days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={avgTxData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                formatter={(value: number) => formatMNEE(value, 2)}
              />
              <Bar dataKey="avg" fill="hsl(var(--chart-3))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
