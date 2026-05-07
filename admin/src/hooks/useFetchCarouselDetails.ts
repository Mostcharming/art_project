import { useEffect, useState } from "react";
import { useApiMutation } from "./useApiMutation";

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  heightInches: number;
  widthInches: number;
  yearOfCreation: number;
  purchasePrice: number;
}

export interface Publisher {
  id: string;
  name: string;
  email: string;
  personaType: "Artist" | "Gallery" | "Collector";
  profilePicture: string;
  bio: string;
  region: string;
  carouselCount: number;
  totalViews: number;
}

export interface CarouselDetails {
  id: string;
  name: string;
  description: string;
  tag: string[];
  country: string;
  views: number;
  numberOfFavorites: number;
  numberOfShares: number;
  completionRate: number;
  averageViewDuration: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  frameTimingSeconds: number;
  isFlagged?: boolean;
  flaggedReason?: string;
  additionalReason?: string;
  flaggedCount?: number;
  publisher: Publisher;
  artworks: Artwork[];
}

export function useFetchCarouselDetails(carouselId: string | undefined) {
  const [carouselDetails, setCarouselDetails] =
    useState<CarouselDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carouselMutation = useApiMutation({
    endpoint: `/admins/carousels/${carouselId}`,
    method: "GET",
  });

  useEffect(() => {
    if (!carouselId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    carouselMutation
      .mutateAsync({})
      .then((response) => {
        if (response.carousel) {
          setCarouselDetails(response.carousel);
          setError(null);
        } else if (response.data) {
          setCarouselDetails(response.data);
          setError(null);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        const errorMessage = err?.message || "Failed to fetch carousel details";
        setError(errorMessage);
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carouselId]);

  return {
    carouselDetails,
    isLoading,
    error,
  };
}
