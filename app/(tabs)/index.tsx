import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ScreenHeader from "@/components/ScreenHeader";
import TripCard from "@/components/TripCard";
import TripStats from "@/components/TripStats";
import EmptyState from "@/components/ui/EmptyState";
import { Colors } from "@/constants/Colors";
import { useTrips } from "@/context/TripContext";
import type { Trip } from "@/types/trip";

const CARD_HEIGHT = 360;

export default function HomeScreen() {
  const { trips, deleteTrip, loading } = useTrips();
  const router = useRouter();

  const sortedTrips = useMemo(() => {
    return [...trips].sort((a, b) => b.rating - a.rating);
  }, [trips]);

  const handleTripPress = useCallback(
    (id: string) => {
      router.push(`/trip/${id}`);
    },
    [router],
  );

  const handleDeleteTrip = useCallback(
    async (id: string) => {
      await deleteTrip(id);
    },
    [deleteTrip],
  );

  const renderTrip = useCallback(
    ({ item }: { item: Trip }) => (
      <TripCard
        id={item.id}
        title={item.title}
        destination={item.destination}
        date={item.date}
        rating={item.rating}
        imageUri={item.imageUri}
        category={item.category}
        notes={item.notes}
        onPress={handleTripPress}
        onDeleteTrip={handleDeleteTrip}
      />
    ),
    [handleTripPress, handleDeleteTrip],
  );

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader tripCount={trips.length} />

      <FlatList
        data={sortedTrips}
        keyExtractor={(item) => item.id}
        renderItem={renderTrip}
        ListHeaderComponent={<TripStats trips={trips} />}
        ListEmptyComponent={
          <EmptyState
            icon="airplane-outline"
            title="No trips yet"
            subtitle="Add your first trip!"
          />
        }
        contentContainerStyle={styles.content}
        style={styles.container}
        getItemLayout={(_, index) => ({
          length: CARD_HEIGHT,
          offset: CARD_HEIGHT * index,
          index,
        })}
        initialNumToRender={10}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
      />

      <Pressable style={styles.fab} onPress={() => router.push("/add-trip")}>
        <Ionicons name="add" size={28} color={Colors.background} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 96,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
