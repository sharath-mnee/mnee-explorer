import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartHeader, TimeRangeSelector, StatsCard, generateTimeSeriesData, formatNumber } from './shared';

export const DailyTransactionsChart = ({ onBack }: { onBack: () => void }) => {
  const [timeRange, setTimeRange] = useState(30);
  const data = generateTimeSeriesData(timeRange, 50000, 10000, 200);
  
  const currentValue = data[data.length - 1].value;
  const previousValue = data[0].value;
  const change = ((currentValue - previousValue) / previousValue * 100).toFixed(2);
  const totalTx = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="container py-8">
      <ChartHeader title="Daily Transactions" onBack={onBack} />
      
      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <StatsCard title="Today's Transactions" value={formatNumber(currentValue, 0)} change={`+${change}%`} />
        <StatsCard title="Total (Period)" value={formatNumber(totalTx, 0)} change={`${timeRange} days`} />
        <StatsCard title="Average Daily" value={formatNumber(totalTx / timeRange, 0)} change="Per day" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction Volume</CardTitle>
            <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={(value: number) => formatNumber(value, 0)} />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};