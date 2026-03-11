import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, typography } from "../../theme/tokens";

export default function OnboardingConsentScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Adatkezelés és hozzájárulás</Text>
      <Text style={styles.paragraph}>
        Az OttLeszek csak a szükséges adatokat gyűjti: belépéshez (e-mail vagy
        telefon), terv és emlékeztetők kezeléséhez. Nem adjuk el adataidat, és
        nem használjuk őket reklámcélra.
      </Text>
      <Text style={styles.paragraph}>
        A részvételi terved és az emlékeztetők a te eszközödön és szerverünkön
        biztonságosan tárolódnak. Bármikor törölheted a fiókodat és kérheted
        adataid exportját a Beállításokban.
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => router.push("/onboarding/login")}
      >
        <Text style={styles.buttonText}>Elfogadom, tovább</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.primary },
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  title: {
    ...typography.headline,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  paragraph: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    marginTop: spacing.lg,
    alignSelf: "flex-start",
  },
  buttonPressed: { opacity: 0.9 },
  buttonText: {
    ...typography.body,
    color: "#fff",
    fontWeight: "600",
  },
});
