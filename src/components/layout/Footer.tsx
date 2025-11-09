import { Link } from 'react-router-dom';
import { Github, Twitter, MessageCircle, Send } from 'lucide-react';
import { FOOTER_NAME, BLOCKCHAIN_NAME, APP_NAME } from '@/utils/constants';

export const Footer = () => {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="px-4 w-full py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">{FOOTER_NAME}</h3>
            <p className="text-sm text-muted-foreground">
              A comprehensive blockchain explorer for MNEE stablecoin on {BLOCKCHAIN_NAME}.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Explorer</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/transactions" className="text-muted-foreground hover:text-foreground">Transactions</Link></li>
              <li><Link to="/blocks" className="text-muted-foreground hover:text-foreground">Blocks</Link></li>
              <li><Link to="/analytics" className="text-muted-foreground hover:text-foreground">Analytics</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/resources" className="text-muted-foreground hover:text-foreground">API Documentation</Link></li>
              <li><Link to="/resources" className="text-muted-foreground hover:text-foreground">Audit Reports</Link></li>
              <li><Link to="/broadcast" className="text-muted-foreground hover:text-foreground">Broadcast Transaction</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <div className="flex space-x-4">
              <a href="https://x.com/MNEE_cash" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://discord.gg/mnee" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="https://github.com/mnee-xyz" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://t.me/mneeusd" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}</p>
        </div>
      </div>
    </footer>
  );
};
