import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Transaction, TransactionFilters, PaginationState } from '@/types/transaction';
import { generateMockTransactions } from '@/utils/mockData';

interface TransactionsState {
  list: Transaction[];
  filters: TransactionFilters;
  pagination: PaginationState;
  loading: boolean;
  selectedTransaction: Transaction | null;
}

const initialState: TransactionsState = {
  list: generateMockTransactions(1000),
  filters: {
    type: 'all',
    amountRange: { min: null, max: null },
    dateRange: { start: null, end: null },
  },
  pagination: {
    page: 1,
    perPage: 25,
    total: 1000,
  },
  loading: false,
  selectedTransaction: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<TransactionFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    setPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSelectedTransaction: (state, action: PayloadAction<Transaction | null>) => {
      state.selectedTransaction = action.payload;
    },
  },
});

export const { setFilters, setPagination, setSelectedTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
