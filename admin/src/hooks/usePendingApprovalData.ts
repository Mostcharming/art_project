import { useEffect, useMemo } from "react";
import { useApiMutation } from "./useApiMutation";

interface PendingApprovalFilters {
  startDate?: string;
  endDate?: string;
}

export interface PendingApprovalItem {
  id: number;
  title: string;
  img: string | null;
  creator: string;
  creatorType: string;
  length: number;
  category: string;
  date: string;
  status: string;
  adminApproved: boolean;
}

export function usePendingApprovalData(filters: PendingApprovalFilters = {}) {
  const filterString = useMemo(() => JSON.stringify(filters), [filters]);

  const mutation = useApiMutation({
    endpoint: "/admins/carousels/pending-approval",
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
