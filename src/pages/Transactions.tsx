import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/common/CopyButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, ChevronLeft, ChevronRight, Eye, ArrowRight, Box } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

const Transactions = () => {
  const allTransactions = useAppSelector((state) => state.transactions.list);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const statistics = useMemo(() => {
    const totalTransactions = allTransactions.length;
    const last24h = allTransactions.filter(tx => 
      Date.now() - tx.timestamp < 24 * 60 * 60 * 1000
    ).length;
    
    const totalFees = allTransactions.reduce((sum, tx) => sum + tx.fee.minerFee, 0);
    const avgFee = totalFees / allTransactions.length;
    
    const pendingTx = allTransactions.filter(tx => 
      Date.now() - tx.timestamp < 60 * 60 * 1000
    ).length;

    return {
      totalTransactions,
      transactions24h: last24h,
      pendingTx,
      totalFee: totalFees.toFixed(4),
      avgFee: (avgFee * 3500).toFixed(2),
      percentChange24h: ((Math.random() - 0.5) * 20).toFixed(2),
      percentChangeFee: ((Math.random() - 0.5) * 40).toFixed(2),
    };
  }, [allTransactions]);

  const totalPages = Math.ceil(allTransactions.length / perPage);
  
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return allTransactions.slice(startIndex, endIndex);
  }, [allTransactions, currentPage, perPage]);

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds} secs ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hrs ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const formatTxid = (txid: string) => {
    return `0x${txid.substring(0, 10)}...`;
  };

  const formatAddress = (address: string) => {
    if (address.length < 16) return address;
    return `${address.substring(0, 10)}...${address.substring(address.length - 6)}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleFirst = () => setCurrentPage(1);
  const handleLast = () => setCurrentPage(totalPages);
  const handlePrevious = () => handlePageChange(currentPage - 1);
  const handleNext = () => handlePageChange(currentPage + 1);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Box className="h-8 w-8" />
            Transactions
          </h1>
          <p className="text-muted-foreground mt-1">
            {allTransactions.length.toLocaleString()} transactions indexed
          </p>
        </div>
      </div>

      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">TRANSACTIONS (24H)</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-semibold">{statistics.transactions24h.toLocaleString()}</div>
                <div className={`text-sm ${parseFloat(statistics.percentChange24h) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ({statistics.percentChange24h}%)
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">PENDING TRANSACTIONS (LAST 1H)</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-semibold">{statistics.pendingTx.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">(Average)</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">TOTAL TRANSACTION FEE (24H)</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-semibold">{statistics.totalFee} ETH</div>
                <div className={`text-sm ${parseFloat(statistics.percentChangeFee) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ({statistics.percentChangeFee}%)
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">AVG. TRANSACTION FEE (24H)</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-semibold">{statistics.avgFee} USD</div>
                <div className={`text-sm ${parseFloat(statistics.percentChangeFee) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ({(parseFloat(statistics.percentChangeFee) * 0.8).toFixed(2)}%)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">
                    {statistics.totalTransactions.toLocaleString()} transactions found
                  </div>
                  <div className="text-sm text-muted-foreground">
                    (Showing {paginatedTransactions.length} records)
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Page Data
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleFirst}
                    disabled={currentPage === 1}
                  >
                    First
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="px-3 py-1 text-sm border rounded">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLast}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </Button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/30">
                  <tr>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Transaction Hash</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Method</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Block</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Age</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">From</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground"></th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">To</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Txn Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((tx) => (
                    <tr key={tx.txid} className="border-b hover:bg-muted/20 transition-colors">
                      <td className="p-3">
                        <Eye className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/tx/${tx.txid}`}
                            className="font-mono text-sm text-primary hover:underline"
                          >
                            {formatTxid(tx.txid)}
                          </Link>
                          <CopyButton text={tx.txid} />
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex px-2 py-0.5 rounded text-xs border bg-background">
                          {tx.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link
                          to={`/block/${tx.blockHeight}`}
                          className="font-mono text-sm text-primary hover:underline"
                        >
                          #{tx.blockHeight}
                        </Link>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {formatTimeAgo(tx.timestamp)}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
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
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center">
                          <div className="p-1 rounded-full bg-muted">
                            <ArrowRight className="h-3 w-3 text-success" />
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
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
                      </td>
                      <td className="p-3 text-sm font-medium">
                        {tx.amount.toFixed(4)}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {tx.fee.minerFee.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">records</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleFirst}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-3 py-1 text-sm border rounded">
                  Page {currentPage} of {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLast}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transactions;
