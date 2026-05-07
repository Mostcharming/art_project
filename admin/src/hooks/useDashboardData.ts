import { useEffect, useMemo } from "react";
import { useDashboardStore } from "../store/dashboardStore";
import { useApiMutation } from "./useApiMutation";

interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  period?: string;
}

export function useDashboardData(filters: DashboardFilters = {}) {
  const {
    setStats,
    setMonthlyChartData,
    setTopCarousels,
    setIsLoadingStats,
    setIsLoadingCarousels,
  } = useDashboardStore();

  // Memoize filters to prevent dependency changes
  const filterString = useMemo(() => JSON.stringify(filters), [filters]);

  // Fetch dashboard stats using useApiMutation
  const statsMutation = useApiMutation({
    endpoint: "/admins/dashboard/stats",
    method: "GET",
  });

  // Fetch monthly chart data using useApiMutation
  const chartMutation = useApiMutation({
    endpoint: "/admins/dashboard/monthly-data",
    method: "GET",
  });

  // Fetch top carousels using useApiMutation
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

  // Trigger chart fetch when filters change
  useEffect(() => {
    chartMutation.mutate(filters);
    // filterString already captures filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterString]);

  // Trigger carousels fetch when filters change
  useEffect(() => {
    setIsLoadingCarousels(true);
    carouselsMutation.mutate({ ...filters, limit: 10 });
    // filterString already captures filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterString, setIsLoadingCarousels]);

  // Update store when stats data changes
  useEffect(() => {
    if (statsMutation.data?.data) {
      setStats(statsMutation.data.data);
    }
    setIsLoadingStats(statsMutation.isLoading);
  }, [
    statsMutation.data,
    statsMutation.isLoading,
    setStats,
    setIsLoadingStats,
    filters,
  ]);

  // Update store when chart data changes
  useEffect(() => {
    if (chartMutation.data?.data) {
      setMonthlyChartData(chartMutation.data.data);
    }
  }, [chartMutation.data, setMonthlyChartData]);

  // Update store when carousels data changes
  useEffect(() => {
    if (carouselsMutation.data?.data) {
      setTopCarousels(carouselsMutation.data.data);
    }
    setIsLoadingCarousels(carouselsMutation.isLoading);
  }, [
    carouselsMutation.data,
    carouselsMutation.isLoading,
    setTopCarousels,
    setIsLoadingCarousels,
  ]);

  return {
    stats: statsMutation.data?.data,
    monthlyData: chartMutation.data?.data,
    carousels: carouselsMutation.data?.data,
    isLoading: statsMutation.isLoading || chartMutation.isLoading,
    isLoadingCarousels: carouselsMutation.isLoading,
    error:
      statsMutation.error || chartMutation.error || carouselsMutation.error,
  };
}
