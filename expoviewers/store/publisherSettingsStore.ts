import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface PublisherSettings {
  carouselFrameTiming: number; // in minutes (float)
  pushNotifications: boolean;
}

export interface PublisherSettingsStore {
  settings: PublisherSettings;
  setSettings: (settings: PublisherSettings) => void;
  updateSettings: (updates: Partial<PublisherSettings>) => void;
  clearSettings: () => void;
}

const defaultSettings: PublisherSettings = {
  carouselFrameTiming: 1, // default 1 minute
  pushNotifications: true,
};

export const usePublisherSettingsStore = create<PublisherSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      setSettings: (settings) => set({ settings }),
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      clearSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: "publisher-settings-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
