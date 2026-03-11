import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth";
import { colors, spacing, typography } from "../../theme/tokens";
import { api } from "../../lib/api";

type ConsentSummary = Record<string, { version: string; acceptedAt: string }>;
type NotificationPrefs = {
  channelPush: boolean;
  channelInApp: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
};

function useConsentSummary(token: string | null) {
  return useQuery({
    queryKey: ["consents", "summary", token],
    queryFn: () =>
      api.request<ConsentSummary>("/consents/summary", {
        token: token ?? undefined,
      }),
    enabled: !!token,
  });
}

function useNotificationPrefs(token: string | null) {
  return useQuery({
    queryKey: ["notification-preferences", token],
    queryFn: () =>
      api.request<NotificationPrefs>("/notification-preferences", {
        token: token ?? undefined,
      }),
    enabled: !!token,
  });
}

export default function SettingsScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { data: consentSummary } = useConsentSummary(token);
  const { data: prefs } = useNotificationPrefs(token);

  const updatePrefs = useMutation({
    mutationFn: (data: Partial<NotificationPrefs>) =>
      api.request("/notification-preferences", {
        method: "PATCH",
        body: JSON.stringify(data),
        token: token ?? undefined,
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["notification-preferences"] }),
  });

  const handleLogout = async () => {
    await clearAuth();
    router.replace("/onboarding");
  };

  const handleExport = async () => {
    if (!token) return;
    try {
      const data = await api.request("/account/export", { token });
      Alert.alert(
        "Export",
        "Az adataidat a fejlesztői konzolban láthatod (dev). Éles alkalmazásban fájl letöltés lesz.",
      );
      console.log("Export data:", data);
    } catch (e) {
      Alert.alert("Hiba", (e as Error).message);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Fiók törlése",
      "Biztosan törlöd a fiókodat? Minden adat véglegesen törlődik.",
      [
        { text: "Mégse", style: "cancel" },
        {
          text: "Törlés",
          style: "destructive",
          onPress: async () => {
            if (!token) return;
            try {
              await api.request("/account", {
                method: "DELETE",
                token,
              });
              await clearAuth();
              router.replace("/onboarding");
            } catch (e) {
              Alert.alert("Hiba", (e as Error).message);
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Beállítások</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hozzájárulások</Text>
        <Text style={styles.paragraph}>
          Az alkalmazás csak a szükséges adatokat gyűjti: belépés, terv,
          emlékeztetők. Nem adjuk el adataidat. Hozzájárulásaid rögzítve:{" "}
          {Object.keys(consentSummary ?? {}).length > 0
            ? "igen"
            : "még nincs rögzítve (onboarding során történik)."}
        </Text>
      </View>

      {prefs && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Értesítések</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Push értesítések</Text>
            <Switch
              value={prefs.channelPush}
              onValueChange={(v) => updatePrefs.mutate({ channelPush: v })}
              trackColor={{ false: colors.border, true: colors.accent.primary }}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Alkalmazás belül</Text>
            <Switch
              value={prefs.channelInApp}
              onValueChange={(v) => updatePrefs.mutate({ channelInApp: v })}
              trackColor={{ false: colors.border, true: colors.accent.primary }}
            />
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Adatkezelés</Text>
        <Pressable style={styles.linkButton} onPress={handleExport}>
          <Text style={styles.linkText}>Adataim exportálása</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fiók</Text>
        <Pressable style={styles.linkButton} onPress={handleLogout}>
          <Text style={styles.linkText}>Kijelentkezés</Text>
        </Pressable>
        <Pressable
          style={[styles.linkButton, styles.dangerButton]}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.dangerText}>Fiók törlése</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.primary },
  container: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  title: {
    ...typography.headline,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  section: { marginBottom: spacing.xl },
  sectionTitle: {
    ...typography.body,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  paragraph: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  linkButton: {
    paddingVertical: spacing.sm,
  },
  linkText: {
    color: colors.accent.primary,
    fontSize: 16,
  },
  dangerButton: { marginTop: spacing.sm },
  dangerText: {
    color: colors.error,
    fontSize: 16,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  switchLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
});
