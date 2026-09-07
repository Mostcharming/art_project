import { useCarouselStore } from "./carouselStore";
import { usePublisherSettingsStore } from "./publisherSettingsStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";

export interface User {
  id?: string;
  email: string;
  isEmailVerified: boolean;
  accountSetupComplete: boolean;
  personaType?: string;
  name?: string;
  country?: string;
  bio?: string;
  profilePicture?: string;
  website?: string;
  termsVersion?: string;
}
const PROFILE_KEY = "carsl.publisher.profile.v2";
const TOKEN_KEY = "carsl.publisher.token.v2";
const fields = ["id", "email", "isEmailVerified", "accountSetupComplete", "personaType", "name", "country", "bio", "profilePicture", "website", "termsVersion"] as const;
const cleanUser = (value: Partial<User>): User => Object.fromEntries(fields.filter(key => value[key] !== undefined).map(key => [key, value[key]])) as unknown as User;
let storageQueue: Promise<unknown> = Promise.resolve();
const serial = <T,>(work: () => Promise<T>): Promise<T> => {
  const result = storageQueue.then(work);
  storageQueue = result.catch(() => undefined);
  return result;
};
const saveProfile = (user: User | null) => {
  void serial(() => user ? AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(user)) : AsyncStorage.removeItem(PROFILE_KEY)).catch(() => undefined);
};
export interface UserStore {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => Promise<void>;
  isAuthenticated: () => boolean;
}
export const useUserStore = create<UserStore>()((set, get) => ({
  user: null,
  token: null,
  hydrated: false,
  setUser: value => { const user = cleanUser(value); set({ user }); saveProfile(user); },
  setToken: async token => {
    if (typeof token !== "string" || !token) throw new Error("Missing session token");
    await serial(async () => {
      if (Platform.OS !== "web") await SecureStore.setItemAsync(TOKEN_KEY, token);
      set({ token });
    });
  },
  updateUser: updates => { const user = cleanUser({ ...get().user, ...updates }); set({ user }); saveProfile(user); },
  clearUser: async () => {
    set({ user: null, token: null });
    useCarouselStore.setState({ currentCarousel: null, carouselDrafts: [] });
    usePublisherSettingsStore.getState().clearSettings();
    await serial(async () => {
      // Clear locally cached drafts too, so the next account cannot inherit them.
      await Promise.all([AsyncStorage.multiRemove([PROFILE_KEY, "user-store", "carousel-store", "publisher-settings-store"]), Platform.OS !== "web" ? SecureStore.deleteItemAsync(TOKEN_KEY) : Promise.resolve()]);
    });
  },
  isAuthenticated: () => !!get().user?.isEmailVerified && !!get().token,
}));
let hydration: Promise<void> | undefined;
export const hydrateUserSession = () => hydration ??= serial(async () => {
  try {
    // Old plaintext tokens/recovery fields are discarded; users sign in once after upgrading.
    if (await AsyncStorage.getItem("user-store")) await AsyncStorage.multiRemove(["user-store", "carousel-store", "publisher-settings-store"]);
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    const token = Platform.OS === "web" ? null : await SecureStore.getItemAsync(TOKEN_KEY);
    const user = raw ? cleanUser(JSON.parse(raw)) : null;
    useUserStore.setState({ user, token });
  } catch {
    useUserStore.setState({ user: null, token: null });
  } finally { useUserStore.setState({ hydrated: true }); }
});
