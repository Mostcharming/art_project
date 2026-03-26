import { create } from "zustand";

export interface DashboardStats {
  totalActiveUsers: number;
  newUsers: number;
  newUsersPercentage: number;
  totalCarousels: number;
  totalCarouselsPercentage: number;
  totalViews: number;
  totalViewsPercentage: number;
  totalFavorites: number;
  totalFavoritesPercentage: number;
}

export interface CarouselData {
  id: number;
  name: string;
  publisherName: string;
  publisherType: string;
  carouselLength: number;
  artCategory: string;
  status: string;
  createdAt: string;
  views: number;
  numberOfFavorites: number;
  numberOfShares: number;
  publisherImage?: string;
  artworkImage?: string;
}

export interface MonthlyData {
  month: string;
  value: number;
}

interface DashboardStore {
  // Stats data
  stats: DashboardStats | null;
  monthlyChartData: MonthlyData[];
  topCarousels: CarouselData[];

  // Loading states
  isLoadingStats: boolean;
  isLoadingCarousels: boolean;

  // Filters
  activePeriod: string;
  selectedDateRange: { start: Date | null; end: Date | null } | null;

  // Actions
  setStats: (stats: DashboardStats) => void;
  setMonthlyChartData: (data: MonthlyData[]) => void;
  setTopCarousels: (carousels: CarouselData[]) => void;
  setIsLoadingStats: (loading: boolean) => void;
  setIsLoadingCarousels: (loading: boolean) => void;
  setActivePeriod: (period: string) => void;
  setSelectedDateRange: (
    range: { start: Date | null; end: Date | null } | null
  ) => void;

  // Computed
  getChartDataForPeriod: (period: string) => MonthlyData[];
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  stats: null,
  monthlyChartData: [],
  topCarousels: [],
  isLoadingStats: false,
  isLoadingCarousels: false,
  activePeriod: "12 months",
  selectedDateRange: null,

  setStats: (stats) => set({ stats }),
  setMonthlyChartData: (monthlyChartData) => set({ monthlyChartData }),
  setTopCarousels: (topCarousels) => set({ topCarousels }),
  setIsLoadingStats: (isLoadingStats) => set({ isLoadingStats }),
  setIsLoadingCarousels: (isLoadingCarousels) => set({ isLoadingCarousels }),
  setActivePeriod: (activePeriod) => set({ activePeriod }),
  setSelectedDateRange: (selectedDateRange) => set({ selectedDateRange }),

  getChartDataForPeriod: (period) => {
    const chartData = get().monthlyChartData;

    switch (period) {
      case "24 hours":
        return chartData.slice(-1);
      case "7 days":
        return chartData.slice(-7);
      case "30 days":
        return chartData.slice(-30);
      case "12 months":
        return chartData;
      default:
        return chartData;
    }
  },
}));
