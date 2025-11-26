import { useParams, Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { CopyButton } from '@/components/common/CopyButton';
import { formatMNEE } from '@/utils/formatters';
import { AlertCircle, Clock } from 'lucide-react';

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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold mb-3">Transaction Details</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-mono text-sm break-all text-primary">{tx.txid}</p>
            <CopyButton text={tx.txid} />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Timestamp (utc)</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">
                    {new Date(tx.timestamp).toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })}
                  </p>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Fees Collected</p>
                <p className="text-lg font-semibold">
                  {formatMNEE(
                    tx.fee.mneeFee + tx.fee.minerFee + tx.fee.utxoBuildCost + tx.fee.transferCost,
                    8
                  )}{' '}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Size</p>
                <p className="text-lg font-semibold">167 B</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Block #{tx.blockHeight}</p>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/block/${tx.blockHeight}`}
                    className="font-mono text-sm break-all text-primary hover:underline"
                  >
                    0000000000000000007bfa00d9ed3f724521fbe424f22219b759ea8896207baf0
                  </Link>
                  <CopyButton text="0000000000000000007bfa00d9ed3f724521fbe424f22219b759ea8896207baf0" />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Version</p>
                <p className="text-lg font-semibold">1</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Confirmations</p>
                <p className="text-lg font-semibold text-success flex items-center gap-2">
                  {tx.confirmations} ✓
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Transaction Type</p>
              <span
                className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                  tx.type === 'mint'
                    ? 'bg-success/10 text-success border border-success/20'
                    : tx.type === 'burn'
                    ? 'bg-destructive/10 text-destructive border border-destructive/20'
                    : 'bg-primary/10 text-primary border border-primary/20'
                }`}
              >
                {tx.type.toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-2">Amount</p>
              <p className="text-3xl font-bold">{formatMNEE(tx.amount, 4)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{tx.from.length} Input{tx.from.length !== 1 ? 's' : ''}</h3>
              <p className="text-sm text-muted-foreground">
                Total Input: <span className="font-semibold">{formatMNEE(tx.amount, 8)}</span>
              </p>
            </div>
            
            <div className="space-y-3">
              {tx.from.map((addr, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs text-muted-foreground">#{idx}</span>
                    <span className="text-sm font-semibold">{formatMNEE(tx.amount, 8)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/address/${addr}`}
                      className="font-mono text-sm text-primary hover:underline break-all"
                    >
                      {addr}
                    </Link>
                    <CopyButton text={addr} />
                  </div>
                  {tx.type === 'mint' && (
                    <p className="text-xs text-muted-foreground mt-2 italic">Newly minted coins</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{tx.to.length} Output{tx.to.length !== 1 ? 's' : ''}</h3>
              <p className="text-sm text-muted-foreground">
                Total Output:{' '}
                <span className="font-semibold">
                  {formatMNEE(
                    tx.amount - (tx.fee.mneeFee + tx.fee.minerFee + tx.fee.utxoBuildCost + tx.fee.transferCost),
                    8
                  )}{' '}
                </span>
              </p>
            </div>
            
            <div className="space-y-3">
              {tx.to.map((addr, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs text-muted-foreground">#{idx}</span>
                    <span className="text-sm font-semibold">
                      {formatMNEE(
                        tx.amount - (tx.fee.mneeFee + tx.fee.minerFee + tx.fee.utxoBuildCost + tx.fee.transferCost),
                        8
                      )}{' '}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/address/${addr}`}
                      className="font-mono text-sm text-primary hover:underline break-all"
                    >
                      {addr}
                    </Link>
                    <CopyButton text={addr} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDetails;
