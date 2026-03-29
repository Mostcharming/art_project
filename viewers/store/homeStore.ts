import { useApiMutate } from '@/utils/useApiMutate';
import { create } from 'zustand';

export interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
  artist: string;
}

export interface Carousel {
  id: string;
  name: string;
  description: string;
  tag?: string;
  imageUrl: string;
  publisher: {
    id: string;
    name: string;
  };
  views: number;
  artworks: Artwork[];
}

export interface Publisher {
  id: string;
  name: string;
  profilePicture: string;
  bio: string;
  personaType: string;
  topCarousel?: Carousel;
}

export interface HomePageData {
  featuredCarousel: Carousel | null;
  trendingCarousels: Carousel[];
  publishers: Publisher[];
}

interface HomeStore {
  homeData: HomePageData;
  isLoading: boolean;
  error: string | null;
  fetchHomeData: () => Promise<void>;
  setHomeData: (data: HomePageData) => void;
}

export const useHomeStore = create<HomeStore>((set: any) => {
  const { mutate } = useApiMutate();

  return {
    homeData: {
      featuredCarousel: null,
      trendingCarousels: [],
      publishers: [],
    },
    isLoading: false,
    error: null,

    fetchHomeData: async () => {
      set({ isLoading: true, error: null });
      try {
        // Fetch featured carousel and trending carousels
        const carouselResponse = await mutate('/home/carousels', {
          method: 'GET',
        });

        if (carouselResponse.error) {
          set({ error: carouselResponse.error, isLoading: false });
          return;
        }

        // Fetch publishers with their top carousel
        const publishersResponse = await mutate('/home/publishers', {
          method: 'GET',
        });

        if (publishersResponse.error) {
          set({ error: publishersResponse.error, isLoading: false });
          return;
        }

        set({
          homeData: {
            featuredCarousel: carouselResponse.data?.featuredCarousel || null,
            trendingCarousels: carouselResponse.data?.trendingCarousels || [],
            publishers: publishersResponse.data?.publishers || [],
          },
          isLoading: false,
          error: null,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch home data',
          isLoading: false,
        });
      }
    },

    setHomeData: (data: HomePageData) => set({ homeData: data }),
  };
});
