import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { colors, spacing, typography } from "../../theme/tokens";
import { api } from "../../lib/api";
import { useAuthStore } from "../../store/auth";

type Reminder = {
  id: string;
  remindAt: string;
  channel: string;
  sentAt: string | null;
};

function useReminders(token: string | null) {
  return useQuery({
    queryKey: ["reminders", token],
    queryFn: () =>
      api.request<Reminder[]>("/reminders", { token: token ?? undefined }),
    enabled: !!token,
  });
}

function formatRemindAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("hu-HU", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RemindersScreen() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  const { data: reminders, isLoading } = useReminders(token);

  const createReminder = useMutation({
    mutationFn: (remindAt: string) =>
      api.request("/reminders", {
        method: "POST",
        body: JSON.stringify({
          remindAt: new Date(remindAt).toISOString(),
          channel: "push",
        }),
        token: token ?? undefined,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });

  const deleteReminder = useMutation({
    mutationFn: (id: string) =>
      api.request(`/reminders/${id}`, {
        method: "DELETE",
        token: token ?? undefined,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });

  const handleAdd = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    createReminder.mutate(d.toISOString(), {
      onError: (e: Error) => Alert.alert("Hiba", e.message),
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Emlékeztetők</Text>
      <Text style={styles.paragraph}>
        Egy emlékeztető holnap 9:00-ra beállítva. (Push értesítés később; most a
        szerveren tároljuk.)
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleAdd}
        disabled={createReminder.isPending}
      >
        <Text style={styles.primaryButtonText}>
          {createReminder.isPending
            ? "Hozzáadás..."
            : "Emlékeztető hozzáadása (holnap 9:00)"}
        </Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Beállított emlékeztetők</Text>
      {(reminders ?? []).length === 0 ? (
        <Text style={styles.muted}>Még nincs emlékeztető.</Text>
      ) : (
        (reminders ?? []).map((r: Reminder) => (
          <View key={r.id} style={styles.reminderCard}>
            <Text style={styles.reminderText}>
              {formatRemindAt(r.remindAt)}
            </Text>
            {r.sentAt && <Text style={styles.sentLabel}>Elküldve</Text>}
            <Pressable
              style={styles.deleteBtn}
              onPress={() =>
                deleteReminder.mutate(r.id, {
                  onError: (e: Error) => Alert.alert("Hiba", e.message),
                })
              }
              disabled={deleteReminder.isPending}
            >
              <Text style={styles.deleteBtnText}>Törlés</Text>
            </Pressable>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.primary },
  container: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
  },
  title: {
    ...typography.headline,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  paragraph: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: "center",
    marginTop: spacing.md,
  },
  buttonPressed: { opacity: 0.9 },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  sectionTitle: {
    ...typography.headline,
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  muted: { ...typography.body, color: colors.text.muted },
  reminderCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  reminderText: { ...typography.body, color: colors.text.primary, flex: 1 },
  sentLabel: {
    ...typography.bodySmall,
    color: colors.success,
    marginRight: spacing.sm,
  },
  deleteBtn: { padding: spacing.xs },
  deleteBtnText: { color: colors.error, fontSize: 14 },
});
