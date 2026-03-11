import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { colors, spacing, typography } from "../../theme/tokens";
import { api } from "../../lib/api";
import { useAuthStore } from "../../store/auth";
import type { Plan, PlanStep } from "../../lib/api";

const MAX_STEPS = 5;

function usePlans(token: string | null) {
  return useQuery({
    queryKey: ["plans", token],
    queryFn: () => api.request<Plan[]>("/plans", { token: token ?? undefined }),
    enabled: !!token,
  });
}

export default function PlanScreen() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  const { data: plans, isLoading } = usePlans(token);
  const plan = plans?.[0];

  const createPlan = useMutation({
    mutationFn: () =>
      api.request<Plan>("/plans", {
        method: "POST",
        body: JSON.stringify({ title: "Részvételi tervem" }),
        token: token ?? undefined,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["plans"] }),
  });

  const addStep = useMutation({
    mutationFn: (title: string) =>
      api.request(`/plans/${plan!.id}/steps`, {
        method: "POST",
        body: JSON.stringify({ title, orderIndex: plan?.steps?.length ?? 0 }),
        token: token ?? undefined,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["plans"] }),
  });

  const [newStepTitle, setNewStepTitle] = useState("");

  const handleCreatePlan = () => {
    createPlan.mutate(undefined, {
      onError: (e) => Alert.alert("Hiba", (e as Error).message),
    });
  };

  const handleAddStep = () => {
    const title = newStepTitle.trim();
    if (!title || !plan) return;
    if ((plan.steps?.length ?? 0) >= MAX_STEPS) {
      Alert.alert("Maximum " + MAX_STEPS + " lépés megadható.");
      return;
    }
    addStep.mutate(title, {
      onSuccess: () => setNewStepTitle(""),
      onError: (e) => Alert.alert("Hiba", (e as Error).message),
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent.primary} />
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Részvételi terv</Text>
        <Text style={styles.paragraph}>
          Hozz létre egy tervet 3–5 lépéssel: pl. „Regisztrálok”, „Megnézem az
          időpontot”, „Elmegyek szavazni”.
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleCreatePlan}
          disabled={createPlan.isPending}
        >
          <Text style={styles.primaryButtonText}>
            {createPlan.isPending ? "Létrehozás..." : "Terv létrehozása"}
          </Text>
        </Pressable>
      </View>
    );
  }

  const stepCount = plan.steps?.length ?? 0;
  const canAddMore = stepCount < MAX_STEPS;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>{plan.title}</Text>
      <Text style={styles.paragraph}>
        {stepCount} / {MAX_STEPS} lépés. Jelöld késznek a Főoldalon.
      </Text>

      {(plan.steps ?? [])
        .sort((a: PlanStep, b: PlanStep) => a.orderIndex - b.orderIndex)
        .map((step: PlanStep) => (
          <View key={step.id} style={styles.stepCard}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            {step.completedAt && <Text style={styles.stepDone}>Kész</Text>}
          </View>
        ))}

      {canAddMore && (
        <View style={styles.addSection}>
          <TextInput
            style={styles.input}
            value={newStepTitle}
            onChangeText={setNewStepTitle}
            placeholder="Új lépés (pl. Elmegyek szavazni)"
            placeholderTextColor={colors.text.muted}
            editable={!addStep.isPending}
          />
          <Pressable
            style={[
              styles.primaryButton,
              addStep.isPending && styles.buttonDisabled,
            ]}
            onPress={handleAddStep}
            disabled={!newStepTitle.trim() || addStep.isPending}
          >
            <Text style={styles.primaryButtonText}>Lépés hozzáadása</Text>
          </Pressable>
        </View>
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
  stepCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepTitle: { ...typography.body, color: colors.text.primary, flex: 1 },
  stepDone: { ...typography.bodySmall, color: colors.success },
  addSection: { marginTop: spacing.lg },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    color: colors.text.primary,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonPressed: { opacity: 0.9 },
  buttonDisabled: { opacity: 0.6 },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
