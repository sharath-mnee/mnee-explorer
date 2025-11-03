import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { formatMNEE, formatTimeAgo } from '@/utils/formatters';
import { Box, ChevronLeft, ChevronRight } from 'lucide-react';

const Blocks = () => {
  const blocks = useAppSelector((state) => state.blocks.list);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const paginatedBlocks = blocks.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(blocks.length / perPage);

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Box className="h-8 w-8" />
            Blocks
          </h1>
          <p className="text-muted-foreground mt-1">
            {blocks.length.toLocaleString()} blocks indexed
          </p>
        </div>
      </div>

      {/* Blocks Grid */}
      <div className="space-y-4">
        {paginatedBlocks.map((block) => (
          <Card key={block.height} className="transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/block/${block.height}`}
                      className="text-2xl font-bold text-primary hover:underline"
                    >
                      #{block.height.toLocaleString()}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      {formatTimeAgo(block.timestamp)}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-muted-foreground break-all">
                    {block.hash}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Transactions: </span>
                      <span className="font-semibold">{block.transactionCount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Unique Addresses: </span>
                      <span className="font-semibold">{block.uniqueAddresses}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:text-right">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total MNEE</p>
                    <p className="text-xl font-bold">{formatMNEE(block.totalMneeTransferred, 2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Avg Transfer</p>
                    <p className="font-semibold">{formatMNEE(block.avgTransferVolume, 2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Largest Tx</p>
                    <p className="font-semibold">{formatMNEE(block.largestTransaction, 2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * perPage) + 1} to{' '}
          {Math.min(currentPage * perPage, blocks.length)} of {blocks.length} blocks
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Blocks;
