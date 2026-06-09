import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { OfflineBanner } from "@/components/OfflineBanner";
import { Colors } from "@/constants/Colors";
import { TripProvider } from "@/context/TripContext";
import { QueryProvider } from "@/providers/QueryProvider";

export default function RootLayout() {
  return (
    <QueryProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TripProvider>
          <OfflineBanner />

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
            <Stack.Screen
              name="trip/[id]"
              options={{ title: "Trip Details" }}
            />
            <Stack.Screen
              name="trip/edit/[id]"
              options={{ title: "Edit Trip" }}
            />
          </Stack>
        </TripProvider>
      </GestureHandlerRootView>
    </QueryProvider>
  );
}
