import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartHeader, TimeRangeSelector, StatsCard, generateTimeSeriesData, formatNumber } from './shared';

export const TotalAddressesChart = ({ onBack }: { onBack: () => void }) => {
  const [timeRange, setTimeRange] = useState(30);
  const data = generateTimeSeriesData(timeRange, 125000, 5000, 400);
  
  const currentValue = data[data.length - 1].value;
  const change = ((currentValue - data[0].value) / data[0].value * 100).toFixed(2);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ChartHeader title="Total Addresses" onBack={onBack} />
      
      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <StatsCard title="Total Addresses" value={formatNumber(currentValue, 0)} change={`+${change}%`} />
        <StatsCard title="Active (7d)" value="45,234" change="36% of total" />
        <StatsCard title="New (24h)" value="1,234" change="+15.4%" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Address Growth</CardTitle>
            <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={(value: number) => formatNumber(value, 0)} />
              <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};