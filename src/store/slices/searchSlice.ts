import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SearchResults {
  transactions: string[];
  addresses: string[];
  blocks: number[];
}

interface SearchState {
  query: string;
  results: SearchResults;
  history: string[];
}

const initialState: SearchState = {
  query: '',
  results: {
    transactions: [],
    addresses: [],
    blocks: [],
  },
  history: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setResults: (state, action: PayloadAction<SearchResults>) => {
      state.results = action.payload;
    },
    addToHistory: (state, action: PayloadAction<string>) => {
      if (!state.history.includes(action.payload)) {
        state.history = [action.payload, ...state.history.slice(0, 9)];
      }
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
});

export const { setQuery, setResults, addToHistory, clearHistory } = searchSlice.actions;
export default searchSlice.reducer;
