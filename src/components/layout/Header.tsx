import { Link } from 'react-router-dom';
import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/themeSlice';
import { APP_NAME } from '@/utils/constants';

export const Header = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
              <img src="/mneeLogo.png" alt="mnee-logo" />
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
