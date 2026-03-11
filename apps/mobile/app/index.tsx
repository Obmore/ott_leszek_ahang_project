import { useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useAuthStore } from "../store/auth";
import { colors, spacing, typography } from "../theme/tokens";

export default function IndexScreen() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    const id = setTimeout(() => {
      if (token) {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboarding");
      }
    }, 0);
    return () => clearTimeout(id);
  }, [token, router]);

  return (
    <View style={[styles.container, Platform.OS === "web" && styles.containerWeb]}>
      <ActivityIndicator size="large" color={colors.accent.primary} />
      <Text style={styles.text}>Betöltés...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
  },
  containerWeb: {
    minHeight: "100vh" as unknown as number,
  },
  text: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
});
