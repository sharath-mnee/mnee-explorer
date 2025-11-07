import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, className }: StatCardProps) => {
  return (
    <Card className={cn('transition-all', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        <CardTitle className="text-xs font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xl font-bold">{value}</div>
        {subtitle && <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>}
        {trend && (
          <p className={cn('text-[10px] mt-0.5', trend.isPositive ? 'text-success' : 'text-destructive')}>
            {trend.isPositive ? '+' : ''}{trend.value}% from yesterday
          </p>
        )}
      </CardContent>
    </Card>
  );
};
