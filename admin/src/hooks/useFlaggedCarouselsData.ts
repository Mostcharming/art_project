import { useEffect, useMemo } from "react";
import { useApiMutation } from "./useApiMutation";

interface FlaggedCarouselsFilters {
  startDate?: string;
  endDate?: string;
}

interface FlaggedCarouselItem {
  id: number;
  title: string;
  img: string | null;
  creator: string;
  creatorType: string;
  reportCount: number;
  dateReported: string;
  reason: string;
  status: string;
}

export function useFlaggedCarouselsData(
  filters: FlaggedCarouselsFilters = {}
): {
  data: FlaggedCarouselItem[];
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  refetch: () => void;
} {
  const filterString = useMemo(() => JSON.stringify(filters), [filters]);

  const mutation = useApiMutation({
    endpoint: "/admins/carousels/flagged",
    method: "GET",
  });

  useEffect(() => {
    mutation.mutate(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterString]);

  return {
    data: mutation.data?.data || [],
    isLoading: mutation.isLoading,
    error: mutation.error,
    refetch: () => mutation.mutate(filters),
  };
}
