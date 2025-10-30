import { Link, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/themeSlice';
import { setQuery } from '@/store/slices/searchSlice';
import { useState } from 'react';
import { APP_NAME } from '@/utils/constants';

export const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.theme.mode);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      dispatch(setQuery(searchInput));
      
      // Simple routing based on input
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
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl">{APP_NAME}</span>
          </Link>
          
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
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by Address / Txn Hash / Block"
              className="w-[400px] pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
