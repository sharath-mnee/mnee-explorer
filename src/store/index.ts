import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice';
import themeReducer from './slices/themeSlice';
import transactionsReducer from './slices/transactionSlice';
import analyticsReducer from './slices/analyticsSlice';
import blocksReducer from './slices/blockSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    theme: themeReducer,
    analytics: analyticsReducer,
    transactions: transactionsReducer,
    blocks: blocksReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
