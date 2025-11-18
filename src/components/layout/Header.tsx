import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/themeSlice';
import { setQuery } from '@/store/slices/searchSlice';
import { APP_NAME } from '@/utils/constants';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { useState } from 'react';

export const Header = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const { generalInfo } = useAppSelector((state) => state.analytics);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  const isDashboard = location.pathname === '/';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      dispatch(setQuery(searchInput));
      
      if (searchInput.length === 64) {
        navigate(`/tx/${searchInput}`);
      } else if (searchInput.length === 34) {
        navigate(`/address/${searchInput}`);
      } else if (!isNaN(Number(searchInput))) {
        navigate(`/block/${searchInput}`);
      } else {
        navigate('/transactions');
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">

          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                <img src="/MNEE LOGO NOBG.svg" alt="mnee-logo" />
              </div>
              <span className="font-bold text-xl">{APP_NAME}</span>
            </Link>

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

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <div className="relative group">
              <button className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1">
                Tools
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-card border border-border rounded-md shadow-lg">
                <Link to="/transactions" className="block px-4 py-2.5 text-sm hover:bg-accent rounded-md"> Browse Transactions</Link>
                <Link to="/blocks" className="block px-4 py-2.5 text-sm hover:bg-accent rounded-md"> Browse Blocks</Link>
              </div>
            </div>

            <div className="relative group">
              <button className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1">
                Stats
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-card border border-border rounded-md shadow-lg">
                <Link to="/analytics" className="block px-4 py-2.5 text-sm hover:bg-accent rounded-md"> View Analytics</Link>
              </div>
            </div>

            <Link
              to="/resources"
              className={`transition-colors hover:text-foreground/80 ${
                location.pathname === '/resources'
                  ? 'text-foreground'
                  : 'text-foreground/60'
              }`}
            >
              Resources
            </Link>
          </nav>

        </div>
        <div className="flex items-center gap-6">

          {!isDashboard && (
            <form
              onSubmit={handleSearch}
              className="hidden md:block relative w-72"
            >
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by Address / Txn Hash / Block"
                className="w-full h-10 pl-11 text-sm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>
          )}

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
