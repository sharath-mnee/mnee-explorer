import { StatCard } from '@/components/common/StasCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useNavigate } from 'react-router-dom';
import { setQuery } from '@/store/slices/searchSlice';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Flame, 
  DollarSign, 
  ArrowUpCircle,
  Search
} from 'lucide-react';
import { formatNumber, formatCurrency, formatMNEE, formatDuration } from '@/utils/formatters';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { formatTimeAgo, formatTxid } from '@/utils/formatters';

const Dashboard = () => {
  const { dashboardMetrics, generalInfo } = useAppSelector((state) => state.analytics);
  const transactions = useAppSelector((state) => state.transactions.list);
  const [searchInput, setSearchInput] = useState('');
  const recentTransactions = transactions.slice(0, 10);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Mock chart data
  const volumeData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    volume: Math.random() * 5000000 + 2000000,
  }));

  const supplyData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    supply: 1000000000 + i * 1000000,
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
      {/* Hero Section */}
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
        <h2 className="text-xl font-semibold mb-4">24 Hour Overview</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Transaction Volume & Active Addresses */}
          <Card className="bg-gradient-to-br from-card/95 to-card/70 border-border/30 shadow-md">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-muted-foreground">
                Network Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                title="Transaction Volume"
                value={formatCurrency(dashboardMetrics.transactionVolume24h, 0)}
                subtitle={`${formatNumber(dashboardMetrics.transactionCount24h)} transactions`}
                icon={TrendingUp}
                className="bg-transparent shadow-none border-none"
              />
              <StatCard
                title="Active Addresses"
                value={formatNumber(dashboardMetrics.activeAddresses24h, 0)}
                subtitle="Unique addresses"
                icon={Users}
                className="bg-transparent shadow-none border-none"
              />
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
              <StatCard
                title="Mint Activity"
                value={formatMNEE(dashboardMetrics.mintActivity24h, 0)}
                subtitle="New tokens minted"
                icon={ArrowUpCircle}
                className="bg-transparent shadow-none border-none"
              />
              <StatCard
                title="Burn Activity"
                value={formatMNEE(dashboardMetrics.burnActivity24h, 0)}
                subtitle="Tokens burned"
                icon={Flame}
                className="bg-transparent shadow-none border-none"
              />
            </CardContent>
          </Card>

          {/* Transaction Fee & MNEE Transferred */}
          <Card className="bg-gradient-to-br from-card/95 to-card/70 border-border/30 shadow-md">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-muted-foreground">
                Transaction Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                title="Avg Transaction Fee"
                value={formatMNEE(dashboardMetrics.avgTransactionFee, 4)}
                icon={DollarSign}
                className="bg-transparent shadow-none border-none"
              />
              <StatCard
                title="Avg MNEE Transferred"
                value={formatMNEE(dashboardMetrics.avgMneeTransferred, 2)}
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

          <Card className="bg-gradient-to-br from-card/95 to-card/70 border-border/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-muted-foreground">
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">MNEE V2 Response Time (Avg)</p>
                <p className="text-2xl font-bold">
                  {formatDuration(generalInfo.mneeV2ResponseTime.avg)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Response Time (Min / Max)</p>
                <p className="text-lg font-semibold">
                  {formatDuration(generalInfo.mneeV2ResponseTime.min)} /{" "}
                  {formatDuration(generalInfo.mneeV2ResponseTime.max)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card/95 to-card/70 border-border/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-muted-foreground">
                Holder Data
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Holder Count</p>
                <p className="text-2xl font-bold">
                  {formatNumber(generalInfo.holderCount, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Burned</p>
                <p className="text-2xl font-bold">
                  {formatMNEE(generalInfo.totalBurned, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Volume Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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

        <Card>
          <CardHeader>
            <CardTitle>Supply Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Average Transaction Value</CardTitle>
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

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Link to="/transactions" className="text-sm text-primary hover:underline">
            View all →
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div
                key={tx.txid}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="flex items-center gap-4">
                  {/* Consistent-width badge */}
                  <div
                    className={`w-20 text-center px-2 py-1 rounded text-xs font-medium tracking-wide ${
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
    </div>
  );
};

export default Dashboard;
