import { useEffect, useState } from "react";
import { useApiMutate } from "./useApiMutate";

export interface DashboardData {
  liveProjects: number;
  subscribers: number;
  watchTimeInHours: number;
}

export const useDashboardData = () => {
  const { mutate } = useApiMutate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await mutate("/carousels/dashboard-data", {
          method: "GET",
        });

        if (response.error) {
          setError(response.error);
          setDashboardData(null);
        } else if (response.data?.dashboardData) {
          setDashboardData({
            liveProjects: response.data.dashboardData.liveProjects,
            subscribers: response.data.dashboardData.subscribers,
            watchTimeInHours: response.data.dashboardData.watchTimeInHours,
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch dashboard data";
        setError(errorMessage);
        setDashboardData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { dashboardData, isLoading, error };
};
