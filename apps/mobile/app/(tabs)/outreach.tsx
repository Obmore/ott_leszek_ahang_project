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

type Contact = { id: string; name: string; contactValue: string };

const TEMPLATES = [
  {
    id: "reminder",
    label: "Emlékeztető",
    text: "Szia! Emlékeztetlek, hogy holnap fontos a részvétel. Üdv!",
  },
];

function useContacts(token: string | null) {
  return useQuery({
    queryKey: ["outreach", "contacts", token],
    queryFn: () =>
      api.request<Contact[]>("/outreach/contacts", {
        token: token ?? undefined,
      }),
    enabled: !!token,
  });
}

export default function OutreachScreen() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  const { data: contacts, isLoading } = useContacts(token);
  const [name, setName] = useState("");
  const [contactValue, setContactValue] = useState("");

  const createContact = useMutation({
    mutationFn: (body: { name: string; contactValue: string }) =>
      api.request("/outreach/contacts", {
        method: "POST",
        body: JSON.stringify(body),
        token: token ?? undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["outreach", "contacts"] });
      setName("");
      setContactValue("");
    },
    onError: (e: Error) => Alert.alert("Hiba", e.message),
  });

  const sendTemplate = useMutation({
    mutationFn: ({
      contactId,
      templateId,
    }: {
      contactId: string;
      templateId: string;
    }) =>
      api.request("/outreach/send", {
        method: "POST",
        body: JSON.stringify({ contactId, templateId }),
        token: token ?? undefined,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["outreach"] }),
    onError: (e: Error) => Alert.alert("Hiba", e.message),
  });

  const deleteContact = useMutation({
    mutationFn: (id: string) =>
      api.request(`/outreach/contacts/${id}`, {
        method: "DELETE",
        token: token ?? undefined,
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["outreach", "contacts"] }),
    onError: (e: Error) => Alert.alert("Hiba", e.message),
  });

  const handleAddContact = () => {
    const n = name.trim();
    const c = contactValue.trim();
    if (!n || !c) {
      Alert.alert("Add meg a nevet és az elérhetőséget (e-mail vagy telefon).");
      return;
    }
    createContact.mutate({ name: n, contactValue: c });
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
      <Text style={styles.title}>Kapcsolatfelvétel</Text>
      <Text style={styles.paragraph}>
        Oszd meg ismerőseiddel a részvétel fontosságát. Csak manuálisan add meg
        a kapcsolatot; mi nem tároljuk az üzenet szövegét.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Új kapcsolat</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Név"
          placeholderTextColor={colors.text.muted}
          editable={!createContact.isPending}
        />
        <TextInput
          style={styles.input}
          value={contactValue}
          onChangeText={setContactValue}
          placeholder="E-mail vagy telefon"
          placeholderTextColor={colors.text.muted}
          keyboardType="email-address"
          editable={!createContact.isPending}
        />
        <Pressable
          style={[
            styles.primaryButton,
            createContact.isPending && styles.buttonDisabled,
          ]}
          onPress={handleAddContact}
          disabled={createContact.isPending}
        >
          <Text style={styles.primaryButtonText}>Hozzáadás</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Kapcsolataid</Text>
      {(contacts ?? []).length === 0 ? (
        <Text style={styles.muted}>Még nincs kapcsolat.</Text>
      ) : (
        (contacts ?? []).map((contact: Contact) => (
          <View key={contact.id} style={styles.contactCard}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactValue}>{contact.contactValue}</Text>
            <View style={styles.contactActions}>
              {TEMPLATES.map((t) => (
                <Pressable
                  key={t.id}
                  style={styles.sendBtn}
                  onPress={() =>
                    sendTemplate.mutate({
                      contactId: contact.id,
                      templateId: t.id,
                    })
                  }
                  disabled={sendTemplate.isPending}
                >
                  <Text style={styles.sendBtnText}>{t.label}</Text>
                </Pressable>
              ))}
              <Pressable
                style={styles.deleteBtn}
                onPress={() => deleteContact.mutate(contact.id)}
                disabled={deleteContact.isPending}
              >
                <Text style={styles.deleteBtnText}>Törlés</Text>
              </Pressable>
            </View>
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
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    ...typography.body,
    fontWeight: "600",
    color: colors.text.primary,
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
    marginBottom: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
  muted: { ...typography.body, color: colors.text.muted },
  contactCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  contactName: {
    ...typography.body,
    fontWeight: "600",
    color: colors.text.primary,
  },
  contactValue: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: 2,
  },
  contactActions: {
    flexDirection: "row",
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  sendBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.accent.primary,
    borderRadius: 6,
  },
  sendBtnText: { color: "#fff", fontSize: 14 },
  deleteBtn: { paddingVertical: spacing.xs },
  deleteBtnText: { color: colors.error, fontSize: 14 },
});
