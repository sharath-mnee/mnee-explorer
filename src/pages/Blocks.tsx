import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Box, ChevronLeft, ChevronRight, Filter, List, LayoutGrid } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

const Blocks = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const perPage = 10;

  const blocks = useAppSelector((state) => state.blocks.list);
  const paginatedBlocks = blocks.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(blocks.length / perPage);

  const formatDate = (timestamp: number | string | Date): string => {
    const date = new Date(timestamp);
    return date.toISOString().replace('T', ' ').substring(0, 19);
  };

  const formatSize = (mb: number): string => {
    if (mb < 1) {
      return `${(mb * 1024).toFixed(2)} KB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            All
          </Button>
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            List View
          </Button>
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('card')}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Card View
          </Button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-3 font-semibold text-sm w-[90px]">Height</th>
                    <th className="text-left py-3 px-3 font-semibold text-sm w-[180px]">Timestamp (UTC)</th>
                    <th className="text-left py-3 px-3 font-semibold text-sm w-[80px]">Age</th>
                    <th className="text-left py-3 px-3 font-semibold text-sm w-[110px]">
                      Delta Time 
                      <span className="ml-1 text-muted-foreground cursor-help" title="Time since last block">ⓘ</span>
                    </th>
                    <th className="text-right py-3 px-3 font-semibold text-sm w-[120px]">Avg Fee</th>
                    <th className="text-right py-3 px-3 font-semibold text-sm w-[120px]">Total Fee</th>
                    <th className="text-right py-3 px-3 font-semibold text-sm w-[110px]">Tx Count</th>
                    <th className="text-right py-3 px-3 font-semibold text-sm w-[90px]">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBlocks.map((block) => (
                    <tr 
                      key={block.height}
                      className="border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-3 truncate">
                        <a
                          href={`block/${block.height}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {block.height.toLocaleString()}
                        </a>
                      </td>

                      <td className="py-3 px-3 text-sm truncate">{formatDate(block.timestamp)}</td>

                      <td className="py-3 px-3 text-sm text-muted-foreground whitespace-nowrap">
                        {block.age}
                      </td>

                      <td className="py-3 px-3 text-sm text-muted-foreground whitespace-nowrap">
                        {block.deltaTime}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-sm whitespace-nowrap">
                        {block.averageFee.toFixed(4)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-sm whitespace-nowrap">
                        {block.totalFee.toFixed(4)}
                      </td>

                      <td className="py-3 px-3 text-right font-medium">
                        {block.transactionCount.toLocaleString()}
                      </td>

                      <td className="py-3 px-3 text-right text-sm whitespace-nowrap">
                        {formatSize(block.size)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card View */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {paginatedBlocks.map((block) => (
            <Card key={block.height} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4 space-y-3">
                <a
                  href={`#/block/${block.height}`}
                  className="text-2xl font-bold text-primary hover:underline block"
                >
                  {block.height.toLocaleString()}
                </a>

                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Timestamp (UTC)</p>
                    <p className="font-medium">{formatDate(block.timestamp)}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1">Age</p>
                    <p className="font-medium">{block.age}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1">Delta Time</p>
                    <p className="font-medium">{block.deltaTime}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1">Average Fee</p>
                    <p className="font-mono text-xs">{block.averageFee.toFixed(4)}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1">Total Fee</p>
                    <p className="font-mono text-xs">{block.totalFee.toFixed(4)}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1">Transactions</p>
                    <p className="font-medium">{block.transactionCount.toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1">Size</p>
                    <p className="font-medium">{formatSize(block.size)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * perPage) + 1} to{' '}
          {Math.min(currentPage * perPage, blocks.length)} of {blocks.length} blocks
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {currentPage > 2 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </Button>
                {currentPage > 3 && <span className="px-2">...</span>}
              </>
            )}
            
            {currentPage > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                {currentPage - 1}
              </Button>
            )}
            
            <Button variant="default" size="sm">
              {currentPage}
            </Button>
            
            {currentPage < totalPages && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                {currentPage + 1}
              </Button>
            )}
            
            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && <span className="px-2">...</span>}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
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
