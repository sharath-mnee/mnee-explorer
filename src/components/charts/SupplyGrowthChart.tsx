import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartHeader, TimeRangeSelector, StatsCard, generateTimeSeriesData, formatNumber, formatMNEE } from './shared';

export const SupplyGrowthChart = ({ onBack }: { onBack: () => void }) => {
  const [timeRange, setTimeRange] = useState(30);
  const data = generateTimeSeriesData(timeRange, 5000000, 1000000, 50000);
  
  const currentValue = data[data.length - 1].value;
  const avgValue = data.reduce((sum, item) => sum + item.value, 0) / data.length;

  return (
    <div className="container py-8">
      <ChartHeader title="Supply Growth" onBack={onBack} />
      
      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <StatsCard title="Latest Growth" value={formatMNEE(currentValue)} change="+8.2% from avg" />
        <StatsCard title="Average Growth" value={formatMNEE(avgValue)} change="Daily average" />
        <StatsCard title="Growth Rate" value="0.52%" change="Per day" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daily Supply Growth</CardTitle>
            <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={(value: number) => formatMNEE(value)} />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};