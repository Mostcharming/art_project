import { UploadedArtwork } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CarouselDraft {
  id?: string;
  name: string;
  tag?: string;
  country: string;
  description?: string;
  frameTimingSeconds: number;
  artworks: UploadedArtwork[];
  status: "draft" | "active" | "scheduled";
  createdAt?: string;
  updatedAt?: string;
}

export interface CarouselStore {
  currentCarousel: CarouselDraft | null;
  carouselDrafts: CarouselDraft[];
  setCurrentCarousel: (carousel: CarouselDraft) => void;
  updateCurrentCarousel: (updates: Partial<CarouselDraft>) => void;
  addArtworkToCarousel: (artwork: UploadedArtwork) => void;
  removeArtworkFromCarousel: (index: number) => void;
  clearCurrentCarousel: () => void;
  saveDraftLocally: (carousel: CarouselDraft) => void;
  removeDraft: (id: string) => void;
  getDrafts: () => CarouselDraft[];
}

export const useCarouselStore = create<CarouselStore>()(
  persist(
    (set, get) => ({
      currentCarousel: null,
      carouselDrafts: [],

      setCurrentCarousel: (carousel: CarouselDraft) =>
        set({ currentCarousel: carousel }),

      updateCurrentCarousel: (updates: Partial<CarouselDraft>) =>
        set((state) => ({
          currentCarousel: state.currentCarousel
            ? { ...state.currentCarousel, ...updates }
            : (updates as CarouselDraft),
        })),

      addArtworkToCarousel: (artwork: UploadedArtwork) =>
        set((state) => ({
          currentCarousel: state.currentCarousel
            ? {
                ...state.currentCarousel,
                artworks: [...(state.currentCarousel.artworks || []), artwork],
              }
            : null,
        })),

      removeArtworkFromCarousel: (index: number) =>
        set((state) => ({
          currentCarousel: state.currentCarousel
            ? {
                ...state.currentCarousel,
                artworks: state.currentCarousel.artworks.filter(
                  (_, i) => i !== index
                ),
              }
            : null,
        })),

      clearCurrentCarousel: () =>
        set({
          currentCarousel: null,
        }),

      saveDraftLocally: (carousel: CarouselDraft) =>
        set((state) => {
          const existingIndex = state.carouselDrafts.findIndex(
            (c) => c.id === carousel.id
          );
          const updatedCarousel = {
            ...carousel,
            updatedAt: new Date().toISOString(),
          };

          if (existingIndex >= 0) {
            const updatedDrafts = [...state.carouselDrafts];
            updatedDrafts[existingIndex] = updatedCarousel;
            return { carouselDrafts: updatedDrafts };
          } else {
            return {
              carouselDrafts: [
                ...state.carouselDrafts,
                {
                  ...updatedCarousel,
                  createdAt: new Date().toISOString(),
                },
              ],
            };
          }
        }),

      removeDraft: (id: string) =>
        set((state) => ({
          carouselDrafts: state.carouselDrafts.filter((c) => c.id !== id),
        })),

      getDrafts: () => {
        const state = get();
        return state.carouselDrafts;
      },
    }),
    {
      name: "carousel-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
