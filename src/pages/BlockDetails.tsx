import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/common/CopyButton';
import { formatMNEE, formatTimeAgo, formatTxid } from '@/utils/formatters';
import { Box, ChevronLeft, ChevronRight, AlertCircle, Clock, Hash, Pickaxe, Binary, Database, FileText, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlockDetails = () => {
  const { height } = useParams();
  const blocks = useAppSelector((state) => state.blocks.list);
  const transactions = useAppSelector((state) => state.transactions.list);
  const block = blocks.find((b) => b.height === parseInt(height || '0'));
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!block) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Block Not Found</h2>
            <p className="text-muted-foreground">
              The block you're looking for doesn't exist or hasn't been mined yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const txcount = block.transactionCount;
  const blockTransactions = transactions.slice(0, txcount).map(tx => ({
    txid: tx.txid,
    blockHeight: tx.blockHeight,
    type: tx.type as 'mint' | 'burn' | 'transfer',
    amount: tx.amount
  }));

  const totalPages = Math.ceil(blockTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = blockTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Box className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Block #{block.height.toLocaleString()}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatTimeAgo(block.timestamp)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild disabled={block.height === 0}>
            <Link to={`/block/${block.height - 1}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/block/${block.height + 1}`}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground mb-1">Block Hash</p>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-mono text-sm break-all text-primary">{block.hash}</p>
                <CopyButton text={block.hash} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Block Height</span>
                </div>
                <span className="font-mono font-semibold">#{block.height.toLocaleString()}</span>
              </div>
              
              <div className="flex items-start justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Timestamp</span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold">
                    {new Date(block.timestamp).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatTimeAgo(block.timestamp)}</p>
                </div>
              </div>

              <div className="flex items-start justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  <Pickaxe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Miner</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold">Mining-Pool</span>
                  <CopyButton text="Mining-Pool" />
                </div>
              </div>

              <div className="flex items-start justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Transactions</span>
                </div>
                <span className="font-mono font-semibold">{block.transactionCount}</span>
              </div>

              <div className="flex items-start justify-between py-2">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Size</span>
                </div>
                <span className="font-mono font-semibold">
                  {(Math.random() * 50 + 10).toFixed(2)} MB
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Binary className="h-5 w-5" />
              Technical Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="py-2 border-b">
                <p className="text-sm text-muted-foreground mb-1">Merkle Root</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs break-all">
                    dd429244b6ae82c80cf01eef4399f49bce3b7e1b9e2d3291e56060e065d5a852
                  </p>
                  <CopyButton text="dd429244b6ae82c80cf01eef4399f49bce3b7e1b9e2d3291e56060e065d5a852" />
                </div>
              </div>

              <div className="flex items-start justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Difficulty</span>
                <span className="font-mono text-sm font-semibold">
                  {(37.115 * Math.pow(10, 9)).toExponential(3)}
                </span>
              </div>

              <div className="py-2 border-b">
                <p className="text-sm text-muted-foreground mb-1">Chainwork</p>
                <p className="font-mono text-xs break-all">
                  437.5x 1024 hashes (169e4277c27779dc4284b97)
                </p>
              </div>

              <div className="flex items-start justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Nonce</span>
                <span className="font-mono text-sm font-semibold">772581981</span>
              </div>

              <div className="flex items-start justify-between py-2">
                <span className="text-sm text-muted-foreground">Confirmations</span>
                <span className="font-mono text-sm font-semibold text-success">
                  {Math.floor(Math.random() * 100) + 7} ✓
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>MNEE Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Total MNEE Transferred</p>
              <p className="text-2xl font-bold text-primary">{formatMNEE(block.totalMneeTransferred, 2)}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg border border-blue-500/20">
              <p className="text-sm text-muted-foreground mb-1">Transaction Count</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{block.transactionCount}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg border border-purple-500/20">
              <p className="text-sm text-muted-foreground mb-1">Unique Addresses</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{block.uniqueAddresses}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-lg border border-amber-500/20">
              <p className="text-sm text-muted-foreground mb-1">Largest Transaction</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatMNEE(block.largestTransaction, 2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Transactions ({blockTransactions.length})
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, blockTransactions.length)} of {blockTransactions.length}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">#</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Transaction ID</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentTransactions.map((tx, idx) => (
                  <tr key={tx.txid} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-sm text-muted-foreground font-mono">
                      #{startIndex + idx}
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/tx/${tx.txid}`}
                        className="font-mono text-sm text-primary hover:underline inline-flex items-center gap-2"
                      >
                        {formatTxid(tx.txid)}
                        <CopyButton text={tx.txid} />
                      </Link>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                          tx.type === 'mint'
                            ? 'bg-success/10 text-success border border-success/20'
                            : tx.type === 'burn'
                            ? 'bg-destructive/10 text-destructive border border-destructive/20'
                            : 'bg-primary/10 text-primary border border-primary/20'
                        }`}
                      >
                        {tx.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-semibold font-mono">
                        {formatMNEE(tx.amount, 2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="min-w-[40px]"
                    >
                      {pageNum}
                    </Button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <span key={pageNum} className="px-2">...</span>;
                }
                return null;
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockDetails;
