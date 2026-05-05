import { Stack } from "expo-router";

import { Colors } from "@/constants/Colors";
import { TripProvider } from "@/context/TripContext";

export default function RootLayout() {
  return (
    <TripProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.textPrimary,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-trip" options={{ title: "Add Trip" }} />
        <Stack.Screen name="trip/[id]" options={{ title: "Trip Details" }} />
        <Stack.Screen name="trip/edit/[id]" options={{ title: "Edit Trip" }} />
      </Stack>
    </TripProvider>
  );
}
