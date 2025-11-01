import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Block } from '@/types/block';
import { generateMockBlocks } from '@/utils/mockData';

interface BlocksState {
  list: Block[];
  currentBlock: Block | null;
  loading: boolean;
}

const initialState: BlocksState = {
  list: generateMockBlocks(100),
  currentBlock: null,
  loading: false,
};

const blocksSlice = createSlice({
  name: 'blocks',
  initialState,
  reducers: {
    setCurrentBlock: (state, action: PayloadAction<Block | null>) => {
      state.currentBlock = action.payload;
    },
  },
});

export const { setCurrentBlock } = blocksSlice.actions;
export default blocksSlice.reducer;
