import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

// Time range options
export const timeRanges = [
  { label: '1D', value: 1 },
  { label: '7D', value: 7 },
  { label: '30D', value: 30 },
  { label: '6M', value: 180 },
  { label: 'All', value: 365 }
];

// Data generator
export const generateTimeSeriesData = (days: number, baseValue: number, variance: number, growth: number = 0) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    const trend = growth * i;
    const random = Math.random() * variance - variance / 2;
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.max(0, baseValue + trend + random),
      timestamp: date.getTime()
    };
  });
};

// Formatters
export const formatNumber = (value: number, decimals: number = 0) => {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toFixed(decimals);
};

export const formatCurrency = (value: number) => {
  return `$${formatNumber(value)}`;
};

export const formatMNEE = (value: number) => {
  return `${formatNumber(value)} 1sat`;
};

// Chart Header Component
export const ChartHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  </div>
);

// Time Range Selector Component
export const TimeRangeSelector = ({ selected, onChange }: { selected: number; onChange: (days: number) => void }) => (
  <div className="flex gap-2">
    {timeRanges.map((range) => (
      <Button
        key={range.value}
        variant={selected === range.value ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange(range.value)}
      >
        {range.label}
      </Button>
    ))}
  </div>
);

// Stats Card Component
export const StatsCard = ({ title, value, change }: { title: string; value: string; change: string }) => (
  <Card>
    <CardContent className="p-4">
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-xs text-green-500">{change}</p>
    </CardContent>
  </Card>
);