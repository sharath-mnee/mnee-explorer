import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartHeader, TimeRangeSelector, StatsCard, generateTimeSeriesData, formatNumber, formatMNEE } from './shared';

export const TotalSupplyChart = ({ onBack }: { onBack: () => void }) => {
  const [timeRange, setTimeRange] = useState(30);
  const data = generateTimeSeriesData(timeRange, 1000000000, 5000000, 100000);
  
  const currentValue = data[data.length - 1].value;
  const previousValue = data[0].value;
  const change = ((currentValue - previousValue) / previousValue * 100).toFixed(2);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ChartHeader title="Total Supply" onBack={onBack} />
      
      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <StatsCard title="Current Supply" value={formatMNEE(currentValue)} change={`+${change}%`} />
        <StatsCard title="Max Supply" value="1.5B 1sat" change="Fixed cap" />
        <StatsCard title="Avg Growth" value={formatMNEE((currentValue - previousValue) / timeRange)} change="Per day" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Supply Over Time</CardTitle>
            <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={(value: number) => formatMNEE(value)} />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};