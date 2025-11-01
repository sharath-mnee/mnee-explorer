import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CopyButton } from '@/components/common/CopyButton';
import { formatMNEE, formatTimeAgo, formatTxid, formatAddress } from '@/utils/formatters';
import { generateMockAddress } from '@/utils/mockData';
import { Wallet, TrendingUp, TrendingDown, Activity, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AddressDetails = () => {
  const { address } = useParams();
  const [activeTab, setActiveTab] = useState('activity');

  if (!address) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Invalid Address</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  const addressData = generateMockAddress(address);

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Wallet className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Address</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-mono text-sm break-all">{address}</p>
          <CopyButton text={address} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-2xl font-bold">{formatMNEE(addressData.balance, 2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Received</p>
                <p className="text-2xl font-bold">{formatMNEE(addressData.totalReceived, 2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">{formatMNEE(addressData.totalSent, 2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Activity className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{addressData.transactionCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">Transaction Hash</th>
                      <th className="text-left p-4 font-medium text-sm">Type</th>
                      <th className="text-left p-4 font-medium text-sm">Amount</th>
                      <th className="text-left p-4 font-medium text-sm">Balance</th>
                      <th className="text-left p-4 font-medium text-sm">Time</th>
                      <th className="text-left p-4 font-medium text-sm">Counterparty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {addressData.transactions.map((tx) => (
                      <tr key={tx.txid} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <Link
                            to={`/tx/${tx.txid}`}
                            className="font-mono text-sm text-primary hover:underline"
                          >
                            {formatTxid(tx.txid)}
                          </Link>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              tx.type === 'in'
                                ? 'bg-success/10 text-success'
                                : 'bg-destructive/10 text-destructive'
                            }`}
                          >
                            {tx.type === 'in' ? 'IN' : 'OUT'}
                          </span>
                        </td>
                        <td className={`p-4 font-medium ${tx.type === 'in' ? 'text-success' : 'text-destructive'}`}>
                          {tx.type === 'in' ? '+' : '-'}{formatMNEE(tx.amount, 2)}
                        </td>
                        <td className="p-4 font-medium">{formatMNEE(tx.runningBalance, 2)}</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatTimeAgo(tx.timestamp)}
                        </td>
                        <td className="p-4">
                          <Link
                            to={`/address/${tx.counterparty}`}
                            className="font-mono text-sm text-primary hover:underline"
                          >
                            {formatAddress(tx.counterparty)}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Address Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">First Seen</p>
                  <p className="text-lg font-semibold">
                    {new Date(addressData.firstSeen).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Last Activity</p>
                  <p className="text-lg font-semibold">
                    {new Date(addressData.lastActivity).toLocaleString()}
                    <span className="text-sm text-muted-foreground ml-2">
                      ({formatTimeAgo(addressData.lastActivity)})
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Net Flow</p>
                  <p className={`text-2xl font-bold ${addressData.totalReceived - addressData.totalSent > 0 ? 'text-success' : 'text-destructive'}`}>
                    {addressData.totalReceived - addressData.totalSent > 0 ? '+' : ''}
                    {formatMNEE(addressData.totalReceived - addressData.totalSent, 2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Generate Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Export transaction history and analytics for this address
              </p>
              <div className="flex gap-2">
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddressDetails;
