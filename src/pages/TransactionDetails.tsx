import { useParams, Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/common/CopyButton';
import { formatMNEE, formatTimeAgo, formatAddress } from '@/utils/formatters';
import { ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/seperator';

const TransactionDetails = () => {
  const { txid } = useParams();
  const transactions = useAppSelector((state) => state.transactions.list);
  const tx = transactions.find((t) => t.txid === txid);

  if (!tx) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Transaction Not Found</h2>
            <p className="text-muted-foreground">
              The transaction hash you're looking for doesn't exist or hasn't been indexed yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Transaction Details</h1>
        <div className="flex items-center gap-2">
          <p className="font-mono text-sm text-muted-foreground break-all">{tx.txid}</p>
          <CopyButton text={tx.txid} />
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {tx.status === 'confirmed' ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <Clock className="h-5 w-5 text-warning" />
            )}
            Transaction Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p
                className={`text-lg font-semibold ${
                  tx.status === 'confirmed' ? 'text-success' : 'text-warning'
                }`}
              >
                {tx.status === 'confirmed' ? 'Confirmed' : 'Pending'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Confirmations</p>
              <p className="text-lg font-semibold">{tx.confirmations}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Timestamp</p>
              <p className="text-lg font-semibold">
                {new Date(tx.timestamp).toLocaleString()}
                <span className="text-sm text-muted-foreground ml-2">
                  ({formatTimeAgo(tx.timestamp)})
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Block Height</p>
              <Link to={`/block/${tx.blockHeight}`} className="text-lg font-semibold text-primary hover:underline">
                #{tx.blockHeight.toLocaleString()}
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Type</p>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  tx.type === 'mint'
                    ? 'bg-success/10 text-success'
                    : tx.type === 'burn'
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                {tx.type.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Amount</p>
              <p className="text-2xl font-bold">{formatMNEE(tx.amount, 2)}</p>
            </div>
            {tx.timeBetweenTx && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground mb-1">Time Between Transactions</p>
                <p className="text-lg font-semibold">{tx.timeBetweenTx.toFixed(2)}s</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fee Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">MNEE Fee (User-Paid)</span>
              <span className="font-semibold">{formatMNEE(tx.fee.mneeFee, 6)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Miner Fee (MNEE-Paid)</span>
              <span className="font-semibold">{formatMNEE(tx.fee.minerFee, 6)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">UTXO Build Cost</span>
              <span className="font-semibold">{formatMNEE(tx.fee.utxoBuildCost, 6)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Transfer Cost</span>
              <span className="font-semibold">{formatMNEE(tx.fee.transferCost, 6)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">Total Fee</span>
              <span className="font-bold">
                {formatMNEE(
                  tx.fee.mneeFee + tx.fee.minerFee + tx.fee.utxoBuildCost + tx.fee.transferCost,
                  6
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card>
        <CardHeader>
          <CardTitle>Address Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full">
              <p className="text-sm font-medium text-muted-foreground mb-3">From</p>
              <div className="space-y-2">
                {tx.from.map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-muted/50 rounded-lg flex items-center justify-between"
                  >
                    <Link
                      to={`/address/${addr}`}
                      className="font-mono text-sm text-primary hover:underline"
                    >
                      {formatAddress(addr)}
                    </Link>
                    <CopyButton text={addr} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex-1 w-full">
              <p className="text-sm font-medium text-muted-foreground mb-3">To</p>
              <div className="space-y-2">
                {tx.to.map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-muted/50 rounded-lg flex items-center justify-between"
                  >
                    <Link
                      to={`/address/${addr}`}
                      className="font-mono text-sm text-primary hover:underline"
                    >
                      {formatAddress(addr)}
                    </Link>
                    <CopyButton text={addr} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDetails;
