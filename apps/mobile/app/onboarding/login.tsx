import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, typography } from "../../theme/tokens";
import { api } from "../../lib/api";
import { useAuthStore } from "../../store/auth";

export default function OnboardingLoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"input" | "code">("input");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async () => {
    const value = phoneOrEmail.trim();
    if (!value) return;
    setLoading(true);
    try {
      await api.request("/auth/otp/request", {
        method: "POST",
        body: JSON.stringify({ phoneOrEmail: value }),
      });
      setStep("code");
    } catch (e) {
      Alert.alert("Hiba", (e as Error).message ?? "Nem sikerült kódot kérni.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const value = phoneOrEmail.trim();
    const codeValue = code.trim();
    if (!value || !codeValue) return;
    setLoading(true);
    try {
      const res = await api.request<{ token: string; userId: string }>(
        "/auth/otp/verify",
        {
          method: "POST",
          body: JSON.stringify({ phoneOrEmail: value, code: codeValue }),
        },
      );
      await setAuth(res.token, res.userId);
      try {
        await api.request("/consents", {
          method: "POST",
          body: JSON.stringify({
            consentType: "onboarding_privacy",
            version: "1",
          }),
          token: res.token,
        });
      } catch {
        // non-blocking
      }
      router.replace("/(tabs)");
    } catch (e) {
      Alert.alert(
        "Hiba",
        (e as Error).message ??
          "Érvénytelen kód. Fejlesztési módban a kód: 123456",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Belépés</Text>
      {step === "input" ? (
        <>
          <Text style={styles.hint}>
            E-mail vagy telefonszám (fejlesztéshez bármi megfelel)
          </Text>
          <TextInput
            style={styles.input}
            value={phoneOrEmail}
            onChangeText={setPhoneOrEmail}
            placeholder="pl. teszt@example.com"
            placeholderTextColor={colors.text.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRequestOtp}
            disabled={loading || !phoneOrEmail.trim()}
          >
            <Text style={styles.buttonText}>
              {loading ? "Küldés..." : "Kód kérése"}
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.hint}>Fejlesztési módban a kód: 123456</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="6 jegyű kód"
            placeholderTextColor={colors.text.muted}
            keyboardType="number-pad"
            maxLength={6}
            editable={!loading}
          />
          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={loading || code.length < 6}
          >
            <Text style={styles.buttonText}>
              {loading ? "Ellenőrzés..." : "Belépés"}
            </Text>
          </Pressable>
          <Pressable
            style={styles.backLink}
            onPress={() => setStep("input")}
            disabled={loading}
          >
            <Text style={styles.backLinkText}>Vissza</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
    justifyContent: "center",
  },
  title: {
    ...typography.headline,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  hint: {
    ...typography.bodySmall,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    color: colors.text.primary,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    ...typography.body,
    color: "#fff",
    fontWeight: "600",
  },
  backLink: {
    marginTop: spacing.md,
  },
  backLinkText: {
    color: colors.accent.primary,
    fontSize: 14,
  },
});
