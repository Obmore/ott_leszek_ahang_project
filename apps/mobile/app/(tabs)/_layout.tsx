import { Tabs } from "expo-router";
import { colors, typography } from "../../theme/tokens";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background.primary },
        headerTintColor: colors.text.primary,
        tabBarStyle: { backgroundColor: colors.background.secondary },
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.muted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Főoldal",
          tabBarLabel: "Főoldal",
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: "Terv",
          tabBarLabel: "Terv",
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: "Emlékeztetők",
          tabBarLabel: "Emlékeztetők",
        }}
      />
      <Tabs.Screen
        name="outreach"
        options={{
          title: "Kapcsolat",
          tabBarLabel: "Kapcsolat",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Beállítások",
          tabBarLabel: "Beállítások",
        }}
      />
    </Tabs>
  );
}
