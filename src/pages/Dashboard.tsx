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
  Search,
  TimerIcon
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
      
      {/* Compact Horizontal Tooltip */}
      {isHovered && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded shadow-lg z-20 px-1 py-1">
          <div className="flex items-center gap-0.5">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setSelectedTimeframe(tf.value)}
                className={`px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors whitespace-nowrap ${
                  selectedTimeframe === tf.value
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
          {/* Arrow pointing down */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-border"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-[3px] w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-popover"></div>
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

  const getAvgResponseTime = (timeframe: Timeframe) => {
  const metrics = generalInfo?.mneeV2ResponseTime?.[timeframe] ?? generalInfo?.mneeV2ResponseTime ?? { avg: 0 };
    return formatDuration(metrics.avg);
  };

  const getMinMaxResponseTime = (timeframe: Timeframe) => {
    const metrics = generalInfo?.mneeV2ResponseTime?.[timeframe] ?? generalInfo?.mneeV2ResponseTime ?? { min: 0, max: 0 };
      return `${formatDuration(metrics.min)} / ${formatDuration(metrics.max)}`;
  };

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

      {/* Overview Metrics*/}
      <div>
        <h2 className="text-lg font-semibold mb-2">Overview</h2>
        <div className="grid gap-2 lg:grid-cols-4">
          {/* Network Activity */}
          <Card className="bg-gradient-to-br from-card/95 to-card/70 border-border/30 shadow-md">
            <CardHeader className="pb-1.5">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Network Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <StatCardWithTimeframe
                title="Transaction Volume"
                getValue={getTransactionVolume}
                getSubtitle={getTransactionSubtitle}
                icon={TrendingUp}
                className="bg-transparent shadow-none border-none p-0"
              />
              <StatCardWithTimeframe
                title="Active Addresses"
                getValue={getActiveAddresses}
                getSubtitle={() => "Unique addresses"}
                icon={Users}
                className="bg-transparent shadow-none border-none p-0"
              />
            </CardContent>
          </Card>

          {/* Token Activity */}
          <Card className="bg-gradient-to-br from-card/95 to-card/70 border-border/30 shadow-md">
            <CardHeader className="pb-1.5">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Token Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <StatCardWithTimeframe
                title="Mint Activity"
                getValue={getMintActivity}
                getSubtitle={() => "New tokens minted"}
                icon={ArrowUpCircle}
                className="bg-transparent shadow-none border-none p-0"
              />
              <StatCardWithTimeframe
                title="Burn Activity"
                getValue={getBurnActivity}
                getSubtitle={() => "Tokens burned"}
                icon={Flame}
                className="bg-transparent shadow-none border-none p-0"
              />
            </CardContent>
          </Card>

          {/* Average Stats */}
          <Card className="bg-gradient-to-br from-card/95 to-card/70 border-border/30 shadow-md">
            <CardHeader className="pb-1.5">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Average Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <StatCardWithTimeframe
                title="Avg Transaction Fee"
                getValue={getAvgTransactionFee}
                icon={DollarSign}
                className="bg-transparent shadow-none border-none p-0"
              />
              <StatCardWithTimeframe
                title="Avg Transferred"
                getValue={getAvgMneeTransferred}
                icon={Activity}
                className="bg-transparent shadow-none border-none p-0"
              />
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-gradient-to-br from-card/95 to-card/70 border-border/30 shadow-md">
            <CardHeader className="pb-1.5">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <StatCardWithTimeframe
                title="MNEE V2 Response Time (Avg)"
                getValue={getAvgResponseTime}
                icon={TimerIcon}
                className="bg-transparent shadow-none border-none p-0"
              />
              <StatCardWithTimeframe
                title="Response Time (Min / Max)"
                getValue={getMinMaxResponseTime}
                icon={TimerIcon}
                className="bg-transparent shadow-none border-none p-0"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* General Information */}
      <div>
        <h2 className="text-lg font-semibold mb-2">General Information</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {/* Token Overview */}
          <Card className="bg-gradient-to-br from-card/95 to-card/70 border-border/30 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Token Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Total Supply</p>
                <p className="text-xl font-bold">{generalInfo.totalSupply}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Market Cap</p>
                <p className="text-xl font-bold">{formatCurrency(generalInfo.marketCap, 0)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">FDV</p>
                <p className="text-xl font-bold">{formatCurrency(generalInfo.fullyDilutedValue, 0)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Average Transaction Value Chart */}
          <Card className="bg-gradient-to-br from-card/95 to-card/70 border-border/30 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Avg Transaction Value (30d)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={avgTxData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                  <XAxis dataKey="date" className="text-[10px]" tick={{ fontSize: 10 }} />
                  <YAxis className="text-[10px]" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => formatMNEE(value, 2)}
                  />
                  <Bar dataKey="avg" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions - Full Height */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Link to="/transactions" className="text-sm text-primary hover:underline">
              View all →
            </Link>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto">
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

        {/* Right Side Charts - Equal Height Distribution */}
        <div className="flex flex-col gap-6">
          {/* Transaction Volume Chart */}
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Transaction Volume Over Time (30days)</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
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
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Supply Growth (30 days)</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
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
    </div>
  );
};

export default Dashboard;
