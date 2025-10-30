import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  mode: 'light' | 'dark';
  autoRefresh: boolean;
}

const initialState: ThemeState = {
  mode: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  autoRefresh: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.mode);
      document.documentElement.classList.toggle('dark', state.mode === 'dark');
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
      localStorage.setItem('theme', state.mode);
      document.documentElement.classList.toggle('dark', state.mode === 'dark');
    },
    toggleAutoRefresh: (state) => {
      state.autoRefresh = !state.autoRefresh;
    },
  },
});

export const { toggleTheme, setTheme, toggleAutoRefresh } = themeSlice.actions;
export default themeSlice.reducer;
