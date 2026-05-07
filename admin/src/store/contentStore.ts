import { create } from "zustand";

export interface CarouselItem {
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

export interface ContentStats {
  totalViews: number;
  totalViewsPercentage: number;
  averageWatchTime: number;
  averageWatchTimePercentage: number;
  engagementRate: number;
  engagementRatePercentage: number;
}

interface ContentStore {
  // Stats data
  stats: ContentStats | null;
  carousels: CarouselItem[];

  // Loading states
  isLoadingStats: boolean;
  isLoadingCarousels: boolean;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalCarousels: number;

  // Actions
  setStats: (stats: ContentStats) => void;
  setCarousels: (carousels: CarouselItem[]) => void;
  setIsLoadingStats: (loading: boolean) => void;
  setIsLoadingCarousels: (loading: boolean) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalCarousels: (total: number) => void;
}

export const useContentStore = create<ContentStore>((set) => ({
  // Initial state
  stats: null,
  carousels: [],
  isLoadingStats: false,
  isLoadingCarousels: false,
  currentPage: 1,
  pageSize: 10,
  totalCarousels: 0,

  // Actions
  setStats: (stats) => set({ stats }),
  setCarousels: (carousels) => set({ carousels }),
  setIsLoadingStats: (loading) => set({ isLoadingStats: loading }),
  setIsLoadingCarousels: (loading) => set({ isLoadingCarousels: loading }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),
  setTotalCarousels: (total) => set({ totalCarousels: total }),
}));
