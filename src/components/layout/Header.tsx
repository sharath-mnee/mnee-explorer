import { Link } from 'react-router-dom';
import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/themeSlice';
import { APP_NAME } from '@/utils/constants';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

export const Header = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const { generalInfo } = useAppSelector((state) => state.analytics);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
    <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
            <img src="/mneeLogo.png" alt="mnee-logo" />
          </div>
          <span className="font-bold text-xl">{APP_NAME}</span>
        </Link>
  
        {/* Price + Peg Deviation badge */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-1 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-border/30 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">$</span>
            </div>
            <span className="text-foreground font-semibold text-sm">
              {formatCurrency(generalInfo.currentPrice, 4)}
            </span>
          </div>
  
          <span className="text-border/50">|</span>
  
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <span>Peg Dev:</span>
            <span
              className={`font-semibold ${
                Math.abs(generalInfo.pegDeviation) < 0.5
                  ? "text-green-400"
                  : "text-orange-400"
              }`}
            >
              {formatPercentage(generalInfo.pegDeviation)}
            </span>
          </div>
        </div>
      </div>
  
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground">
            Dashboard
          </Link>
          <Link to="/transactions" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Transactions
          </Link>
          <Link to="/blocks" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Blocks
          </Link>
          <Link to="/holders" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Holders
          </Link>
          <Link to="/analytics" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Analytics
          </Link>
          <Link to="/resources" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Resources
          </Link>
        </nav>
  
        <Button variant="ghost" size="icon" onClick={() => dispatch(toggleTheme())}>
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
  
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </div>
  </header>
  );
};
