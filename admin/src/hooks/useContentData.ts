import { useEffect, useMemo } from "react";
import { useContentStore } from "../store/contentStore";
import { useApiMutation } from "./useApiMutation";

interface ContentFilters {
  startDate?: string;
  endDate?: string;
  period?: string;
  page?: number;
  limit?: number;
}

export function useContentData(filters: ContentFilters = {}) {
  const {
    setStats,
    setCarousels,
    setIsLoadingStats,
    setIsLoadingCarousels,
    setTotalCarousels,
  } = useContentStore();

  // Memoize filters to prevent dependency changes
  const filterString = useMemo(() => JSON.stringify(filters), [filters]);

  // Fetch content stats using useApiMutation
  const statsMutation = useApiMutation({
    endpoint: "/admins/dashboard/stats",
    method: "GET",
  });

  // Fetch carousels using useApiMutation
  const carouselsMutation = useApiMutation({
    endpoint: "/admins/dashboard/top-carousels",
    method: "GET",
  });

  // Trigger stats fetch when filters change
  useEffect(() => {
    setIsLoadingStats(true);
    statsMutation.mutate(filters);
    // filterString already captures filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterString, setIsLoadingStats]);

  // Trigger carousels fetch when filters change
  useEffect(() => {
    setIsLoadingCarousels(true);
    carouselsMutation.mutate({
      ...filters,
      limit: filters.limit || 10,
      offset: filters.page ? (filters.page - 1) * (filters.limit || 10) : 0,
    });
    // filterString already captures filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterString, setIsLoadingCarousels]);

  // Update store when stats data changes
  useEffect(() => {
    if (statsMutation.data?.data) {
      const data = statsMutation.data.data;
      // Transform data if needed
      setStats({
        totalViews: data.totalViews || 0,
        totalViewsPercentage: data.totalViewsPercentage || 0,
        averageWatchTime: 70, // This would need to come from API
        averageWatchTimePercentage: data.averageWatchTimePercentage || 0,
        engagementRate: 54, // This would need to come from API
        engagementRatePercentage: data.engagementRatePercentage || 0,
      });
    }
    setIsLoadingStats(statsMutation.isLoading);
  }, [
    statsMutation.data,
    statsMutation.isLoading,
    setStats,
    setIsLoadingStats,
  ]);

  // Update store when carousels data changes
  useEffect(() => {
    if (carouselsMutation.data?.data) {
      const carouselsData = Array.isArray(carouselsMutation.data.data)
        ? carouselsMutation.data.data
        : carouselsMutation.data.data.carousels || [];

      setCarousels(carouselsData);

      // Set total carousels count if provided
      if (carouselsMutation.data.total) {
        setTotalCarousels(carouselsMutation.data.total);
      }
    }
    setIsLoadingCarousels(carouselsMutation.isLoading);
  }, [
    carouselsMutation.data,
    carouselsMutation.isLoading,
    setCarousels,
    setIsLoadingCarousels,
    setTotalCarousels,
  ]);

  return {
    stats: statsMutation.data?.data,
    carousels: carouselsMutation.data?.data,
    isLoadingStats: statsMutation.isLoading,
    isLoadingCarousels: carouselsMutation.isLoading,
    error: statsMutation.error || carouselsMutation.error,
  };
}
