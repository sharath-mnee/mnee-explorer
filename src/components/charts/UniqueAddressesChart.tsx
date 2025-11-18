import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartHeader, TimeRangeSelector, StatsCard, generateTimeSeriesData, formatNumber } from './shared';

export const UniqueAddressesChart = ({ onBack }: { onBack: () => void }) => {
  const [timeRange, setTimeRange] = useState(30);
  const data = generateTimeSeriesData(timeRange, 8000, 2000, 100);
  
  const currentValue = data[data.length - 1].value;
  const change = ((currentValue - data[0].value) / data[0].value * 100).toFixed(2);

  return (
    <div className="container py-8">
      <ChartHeader title="Unique Addresses" onBack={onBack} />
      
      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <StatsCard title="Active Today" value={formatNumber(currentValue, 0)} change={`+${change}%`} />
        <StatsCard title="Total Addresses" value="125,432" change="+12.5% growth" />
        <StatsCard title="New Today" value="1,234" change="+15.4%" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daily Active Addresses</CardTitle>
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
              <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};