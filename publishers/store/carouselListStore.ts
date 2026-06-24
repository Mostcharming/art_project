import type { Carousel, CarouselType } from "@/hooks/useCarouselList";
import { create } from "zustand";

type CarouselLists = Record<CarouselType, Carousel[]>;

interface CarouselListStore {
  carouselsByType: CarouselLists;
  editingCarousel: Carousel | null;
  setCarousels: (type: CarouselType, carousels: Carousel[]) => void;
  setEditingCarousel: (carousel: Carousel | null) => void;
  upsertCarousel: (carousel: Carousel) => void;
}

const emptyLists: CarouselLists = {
  published: [],
  scheduled: [],
  drafts: [],
};

const getCarouselType = (carousel: Carousel): CarouselType => {
  if (carousel.status === "active") return "published";
  if (carousel.status === "scheduled") return "scheduled";
  return "drafts";
};

export const useCarouselListStore = create<CarouselListStore>()((set) => ({
  carouselsByType: emptyLists,
  editingCarousel: null,

  setCarousels: (type, carousels) =>
    set((state) => ({
      carouselsByType: {
        ...state.carouselsByType,
        [type]: carousels,
      },
    })),

  setEditingCarousel: (carousel) => set({ editingCarousel: carousel }),

  upsertCarousel: (carousel) =>
    set((state) => {
      const nextLists = { ...state.carouselsByType };
      const targetType = getCarouselType(carousel);

      (Object.keys(nextLists) as CarouselType[]).forEach((type) => {
        const list = nextLists[type];
        const existingIndex = list.findIndex((item) => item.id === carousel.id);

        if (type === targetType) {
          if (existingIndex >= 0) {
            const updatedList = [...list];
            updatedList[existingIndex] = {
              ...updatedList[existingIndex],
              ...carousel,
            };
            nextLists[type] = updatedList;
          } else {
            nextLists[type] = [carousel, ...list];
          }
        } else if (existingIndex >= 0) {
          nextLists[type] = list.filter((item) => item.id !== carousel.id);
        }
      });

      return { carouselsByType: nextLists };
    }),
}));
