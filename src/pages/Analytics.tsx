import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, Users, Activity, DollarSign, Package, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data generator
const generateChartData = (days: number, baseValue: number, variance: number) => {
  return Array.from({ length: days }, (_, i) => ({
    timestamp: Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000,
    value: baseValue + Math.random() * variance - variance / 2,
  }));
};

const formatNumber = (value: number, decimals: number = 0) => {
  return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const formatMNEE = (value: number, decimals: number = 2) => {
  return `${formatNumber(value, decimals)} 1sat`;
};

const Analytics = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'market' | 'transactions'>('overview');


  // Overview Stats
  const overviewStats = [
    { 
      title: 'Total Addresses', 
      value: '125,432', 
      icon: Users, 
      route: '/chart/addresses',
      change: '+12.5%'
    },
    { 
      title: 'Total Transactions', 
      value: '2,458,392', 
      icon: Activity, 
      route: '/transactions',
      change: '+8.3%'
    }
  ];

  // Market Data Charts (simple preview data)
  const marketDataCharts = [
    { 
      id: 'total-supply', 
      title: 'Total Supply', 
      route: '/chart/total-supply',
      data: generateChartData(30, 1000000000, 10000000).map(p => ({ value: p.value }))
    },
    { 
      id: 'market-cap', 
      title: 'Market Cap', 
      route: '/chart/market-cap',
      data: generateChartData(30, 1200000000, 50000000).map(p => ({ value: p.value }))
    },
    { 
      id: 'supply-growth', 
      title: 'Supply Growth', 
      route: '/chart/supply-growth',
      data: generateChartData(30, 5000000, 1000000).map(p => ({ value: p.value }))
    },
  ];

  // Transaction Data Charts
  const transactionCharts = [
    { 
      id: 'daily-transactions', 
      title: 'Daily Transactions', 
      route: '/chart/daily-transactions',
      data: generateChartData(30, 50000, 10000).map(p => ({ value: p.value }))
    },
    { 
      id: 'unique-addresses', 
      title: 'Unique Addresses', 
      route: '/chart/unique-addresses',
      data: generateChartData(30, 8000, 2000).map(p => ({ value: p.value }))
    },
    { 
      id: 'avg-block-size', 
      title: 'Average Block Size', 
      route: '/chart/avg-block-size',
      data: generateChartData(30, 1200, 300).map(p => ({ value: p.value }))
    },
    { 
      id: 'avg-tx-fee', 
      title: 'Avg Transaction Fee', 
      route: '/chart/avg-tx-fee',
      data: generateChartData(30, 0.5, 0.2).map(p => ({ value: p.value }))
    },
  ];

  // Pie chart data
  const pieData = [
    { name: 'Circulating', value: 850000000, color: 'hsl(var(--primary))' },
    { name: 'Locked', value: 100000000, color: 'hsl(var(--chart-2))' },
    { name: 'Burned', value: 50000000, color: 'hsl(var(--chart-3))' },
  ];

  const scrollToSection = (section: string) => {
    setActiveSection(section as any);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full py-8 flex gap-6 sm:px-6 lg:px-8">
      {/* Sidebar Navigation */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-2">
          <Button
            variant={activeSection === 'overview' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => scrollToSection('overview')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeSection === 'market' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => scrollToSection('market')}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Market Data
          </Button>
          <Button
            variant={activeSection === 'transactions' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => scrollToSection('transactions')}
          >
            <Activity className="h-4 w-4 mr-2" />
            Transaction Data
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-muted-foreground mt-1">Network metrics and insights</p>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div id="overview">
          <h2 className="text-xl font-semibold mb-4">Overview Statistics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {overviewStats.map((stat) => (
              <Card 
                key={stat.title}
                className="cursor-pointer transition-shadow group"
                onClick={() => navigate(stat.route)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className="h-8 w-8 text-primary" />
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-success mt-1">{stat.change} this month</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Market Data Section */}
        <div id="market">
          <h2 className="text-xl font-semibold mb-4">Market Data</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Total Supply & Market Cap Pie Chart */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/chart/supply-distribution')}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Supply Distribution
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatMNEE(value, 0)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Other Market Charts */}
            {marketDataCharts.map((chart) => (
              <Card 
                key={chart.id}
                className="cursor-pointer transition-shadow group"
                onClick={() => navigate(chart.route)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    {chart.title}
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={150}>
                    <AreaChart data={chart.data}>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary) / 0.2)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Transaction Data Section */}
        <div id="transactions">
          <h2 className="text-xl font-semibold mb-4">Transaction Data</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {transactionCharts.map((chart) => (
              <Card 
                key={chart.id}
                className="cursor-pointer transition-shadow group"
                onClick={() => navigate(chart.route)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-sm">
                    {chart.title}
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={chart.data}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;