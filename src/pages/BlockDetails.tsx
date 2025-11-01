import { useParams, Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/common/CopyButton';
import { formatMNEE, formatTimeAgo, formatTxid } from '@/utils/formatters';
import { Box, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlockDetails = () => {
  const { height } = useParams();
  const blocks = useAppSelector((state) => state.blocks.list);
  const transactions = useAppSelector((state) => state.transactions.list);
  const block = blocks.find((b) => b.height === parseInt(height || '0'));

  if (!block) {
    return (
      <div className="container py-8">
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

  const blockTransactions = transactions.filter((tx) => tx.blockHeight === block.height);

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Box className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Block #{block.height.toLocaleString()}</h1>
            <p className="text-muted-foreground">{formatTimeAgo(block.timestamp)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/block/${block.height - 1}`}>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/block/${block.height + 1}`}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Block Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Block Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Block Height</p>
              <p className="text-xl font-bold">#{block.height.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Timestamp</p>
              <p className="text-xl font-bold">
                {new Date(block.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Block Hash</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm break-all">{block.hash}</p>
                <CopyButton text={block.hash} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MNEE Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>MNEE Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total MNEE Transferred</p>
              <p className="text-2xl font-bold">{formatMNEE(block.totalMneeTransferred, 2)}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Transaction Count</p>
              <p className="text-2xl font-bold">{block.transactionCount}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Unique Addresses</p>
              <p className="text-2xl font-bold">{block.uniqueAddresses}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Largest Transaction</p>
              <p className="text-2xl font-bold">{formatMNEE(block.largestTransaction, 2)}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Avg Transfer Volume</p>
              <p className="text-2xl font-bold">{formatMNEE(block.avgTransferVolume, 2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({blockTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {blockTransactions.map((tx) => (
              <div key={tx.txid} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        tx.type === 'mint'
                          ? 'bg-success/10 text-success'
                          : tx.type === 'burn'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {tx.type.toUpperCase()}
                    </span>
                    <Link
                      to={`/tx/${tx.txid}`}
                      className="font-mono text-sm text-primary hover:underline"
                    >
                      {formatTxid(tx.txid)}
                    </Link>
                  </div>
                  <p className="font-semibold">{formatMNEE(tx.amount, 2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockDetails;
