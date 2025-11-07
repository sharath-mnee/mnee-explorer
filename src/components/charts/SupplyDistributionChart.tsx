import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartHeader, TimeRangeSelector, StatsCard, formatMNEE, generateTimeSeriesData } from './shared';

export const SupplyDistributionChart = ({ onBack }: { onBack: () => void }) => {
  const [timeRange, setTimeRange] = useState(30);
  
  // Generate separate data for each
const circulatingSupplyData = generateTimeSeriesData(timeRange, 800000000, 5000000, 100000);
const lockedSupplyData = generateTimeSeriesData(timeRange, 150000000, 2000000, 50000);
const burnedSupplyData = generateTimeSeriesData(timeRange, 50000000, 1000000, 20000);

const circulatingSupply = circulatingSupplyData.at(-1)?.value ?? 0;
const lockedSupply = lockedSupplyData.at(-1)?.value ?? 0;
const burnedSupply = burnedSupplyData.at(-1)?.value ?? 0;

const pieData = [
  { name: 'Circulating', value: circulatingSupply, color: '#3b82f6' },
  { name: 'Locked', value: lockedSupply, color: '#8b5cf6' },
  { name: 'Burned', value: burnedSupply, color: '#ef4444' }
];

const total = pieData.reduce((sum, item) => sum + item.value, 0);


  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ChartHeader title="Supply Distribution" onBack={onBack} />
      
      <div className="grid gap-6 mb-6 md:grid-cols-3">
        {pieData.map((item) => (
          <StatsCard
            key={item.name}
            title={item.name}
            value={formatMNEE(item.value)}
            change={`${((item.value / total) * 100).toFixed(1)}% of total`}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Token Distribution</CardTitle>
            <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatMNEE(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};