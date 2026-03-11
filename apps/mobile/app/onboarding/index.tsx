import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, typography } from "../../theme/tokens";

export default function OnboardingWelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OttLeszek</Text>
      <Text style={styles.subtitle}>
        Magánéletedet tisztelő, részvételi emlékeztető és tervkészítő. Egy
        egyszerű terv, emlékeztetők, és opcionális kapcsolatfelvétel azokkal,
        akiket ismersz.
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => router.push("/onboarding/consent")}
      >
        <Text style={styles.buttonText}>Tovább</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    ...typography.body,
    color: "#fff",
    fontWeight: "600",
  },
});
