import { useEffect, useState } from "react";
import { useApiMutate } from "./useApiMutate";

export interface Artwork {
  id: number;
  carouselId: number;
  title: string;
  artist: string;
  heightInches: number;
  widthInches: number;
  yearOfCreation: number;
  purchasePrice: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Carousel {
  id: number;
  publisherId: number;
  name: string;
  tag?: string;
  country: string;
  description?: string;
  frameTimingSeconds: number;
  status: "draft" | "scheduled" | "active";
  views: number;
  shares: number;
  favorites: number;
  scheduledPublishDate?: string;
  artworks: Artwork[];
  createdAt: string;
  updatedAt: string;
}

export type CarouselType = "publishers" | "scheduled" | "drafts";

export interface UseCarouselListResponse {
  carousels: Carousel[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCarouselList = (
  type: CarouselType
): UseCarouselListResponse => {
  const { mutate } = useApiMutate();
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let endpoint = "";
        switch (type) {
          case "publishers":
            endpoint = "/carousels/active";
            break;
          case "scheduled":
            endpoint = "/carousels/scheduled";
            break;
          case "drafts":
            endpoint = "/carousels/drafts";
            break;
        }

        const response = await mutate(endpoint, {
          method: "GET",
        });

        if (response.error) {
          setError(response.error);
          setCarousels([]);
        } else if (response.data?.carousels) {
          setCarousels(response.data.carousels);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch carousels";
        setError(errorMessage);
        setCarousels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarousels();
  }, [type]);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let endpoint = "";
      switch (type) {
        case "publishers":
          endpoint = "/carousels/active";
          break;
        case "scheduled":
          endpoint = "/carousels/scheduled";
          break;
        case "drafts":
          endpoint = "/carousels/drafts";
          break;
      }

      const response = await mutate(endpoint, {
        method: "GET",
      });

      if (response.error) {
        setError(response.error);
        setCarousels([]);
      } else if (response.data?.carousels) {
        setCarousels(response.data.carousels);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch carousels";
      setError(errorMessage);
      setCarousels([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { carousels, isLoading, error, refetch };
};
