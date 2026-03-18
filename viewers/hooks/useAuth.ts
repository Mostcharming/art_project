import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/utils/apiClient";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert } from "react-native";

/**
 * Hook for managing authentication in components
 */
export const useAuth = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        await apiClient.login(email, password);
        router.replace("/(tabs)");
        return true;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Login failed";
        Alert.alert("Login Error", errorMessage);
        return false;
      }
    },
    [router]
  );

  const handleLogout = useCallback(async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await apiClient.logout();
            router.replace("/(auth)/login");
          } catch (error: any) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
        style: "destructive",
      },
    ]);
  }, [router]);

  const handleLogoutSilent = useCallback(async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Silent logout error:", error);
    }
  }, []);

  return {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    handleLogin,
    handleLogout,
    handleLogoutSilent,
  };
};
