import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DashboardMetrics, GeneralInfo, AddressMetrics, NetworkMetrics, TimeRange } from '@/types/analytics';
import { generateDashboardMetrics, generateGeneralInfo, generateChartData } from '@/utils/mockData';

interface AnalyticsState {
  dashboardMetrics: DashboardMetrics;
  generalInfo: GeneralInfo;
  addressMetrics: AddressMetrics;
  networkMetrics: NetworkMetrics;
  timeRange: TimeRange;
  loading: boolean;
}

const initialState: AnalyticsState = {
  dashboardMetrics: generateDashboardMetrics(),
  generalInfo: generateGeneralInfo(),
  addressMetrics: {
    newAddressesPerDay: generateChartData(30, 100, 50),
    activeAddressesPerDay: generateChartData(30, 500, 200),
    cumulativeAddressGrowth: generateChartData(30, 10000, 500),
  },
  networkMetrics: {
    blockTimeTrends: generateChartData(30, 600, 100),
    blockProductionRate: generateChartData(30, 144, 20),
  },
  timeRange: { label: '30D', days: 30 },
  loading: false,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<TimeRange>) => {
      state.timeRange = action.payload;
    },
  },
});

export const { setTimeRange } = analyticsSlice.actions;
export default analyticsSlice.reducer;
