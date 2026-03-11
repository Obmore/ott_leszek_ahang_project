import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { colors, spacing, typography } from "../../theme/tokens";
import { api } from "../../lib/api";
import { useAuthStore } from "../../store/auth";
import type { Plan, PlanStep } from "../../lib/api";

function usePlans(token: string | null) {
  return useQuery({
    queryKey: ["plans", token],
    queryFn: () => api.request<Plan[]>("/plans", { token: token ?? undefined }),
    enabled: !!token,
  });
}

function useCommitments(token: string | null) {
  return useQuery({
    queryKey: ["commitments", token],
    queryFn: () =>
      api.request<{ id: string; committedAt: string }[]>("/commitments", {
        token: token ?? undefined,
      }),
    enabled: !!token,
  });
}

function useCreateCommitment(token: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api.request("/commitments", {
        method: "POST",
        token: token ?? undefined,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["commitments"] }),
  });
}

function useUpdateStep(token: string | null, planId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      stepId,
      completedAt,
    }: {
      stepId: string;
      completedAt: string | null;
    }) =>
      api.request(`/plans/${planId}/steps/${stepId}`, {
        method: "PATCH",
        body: JSON.stringify({ completedAt }),
        token: token ?? undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

export default function DashboardScreen() {
  const token = useAuthStore((s) => s.token);
  const { data: plans, isLoading: plansLoading } = usePlans(token);
  const { data: commitments, isLoading: commitmentsLoading } =
    useCommitments(token);
  const createCommitment = useCreateCommitment(token);
  const plan = plans?.[0];
  const updateStep = useUpdateStep(token, plan?.id ?? "");

  const hasCommitted = (commitments?.length ?? 0) > 0;

  const handleCommit = () => {
    createCommitment.mutate(undefined, {
      onError: (e: Error) => console.warn(e),
    });
  };

  const handleToggleStep = (step: PlanStep) => {
    if (!plan) return;
    const completedAt = step.completedAt ? null : new Date().toISOString();
    updateStep.mutate({ stepId: step.id, completedAt });
  };

  if (plansLoading || commitmentsLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {!hasCommitted && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Elköteleződés</Text>
          <Text style={styles.cardText}>
            Jelöld ki, hogy részt veszel. Egy kattintás, nincs kötelező adat.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleCommit}
            disabled={createCommitment.isPending}
          >
            <Text style={styles.primaryButtonText}>
              {createCommitment.isPending ? "Küldés..." : "Részveszek"}
            </Text>
          </Pressable>
        </View>
      )}

      {hasCommitted && (
        <View style={styles.card}>
          <Text style={styles.successText}>✓ Elköteleződtél</Text>
        </View>
      )}

      {plan ? (
        <>
          <Text style={styles.sectionTitle}>{plan.title}</Text>
          {plan.steps.length === 0 ? (
            <Text style={styles.muted}>
              Még nincs lépés. Add hozzá a Terv fülön.
            </Text>
          ) : (
            plan.steps
              .sort((a: PlanStep, b: PlanStep) => a.orderIndex - b.orderIndex)
              .map((step: PlanStep) => (
                <Pressable
                  key={step.id}
                  style={styles.stepRow}
                  onPress={() => handleToggleStep(step)}
                >
                  <Text
                    style={[
                      styles.stepBullet,
                      step.completedAt && styles.stepDone,
                    ]}
                  >
                    {step.completedAt ? "✓" : "○"}
                  </Text>
                  <Text
                    style={[
                      styles.stepTitle,
                      step.completedAt && styles.stepTitleDone,
                    ]}
                    numberOfLines={2}
                  >
                    {step.title}
                  </Text>
                </Pressable>
              ))
          )}
        </>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Még nincs terved. Hozz létre egyet a Terv fülön.
          </Text>
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
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typography.headline,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  cardText: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  successText: {
    ...typography.body,
    color: colors.success,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buttonPressed: { opacity: 0.9 },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  sectionTitle: {
    ...typography.headline,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  muted: {
    ...typography.body,
    color: colors.text.muted,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepBullet: {
    fontSize: 18,
    color: colors.text.secondary,
    marginRight: spacing.sm,
    width: 24,
  },
  stepDone: { color: colors.success },
  stepTitle: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  stepTitleDone: {
    textDecorationLine: "line-through",
    color: colors.text.muted,
  },
});
