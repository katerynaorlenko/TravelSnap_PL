import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import AnimatedFab from "@/components/AnimatedFab";
import AnimatedTripCard from "@/components/AnimatedTripCard";
import ScreenHeader from "@/components/ScreenHeader";
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

  const handleAddTrip = useCallback(() => {
    router.push("/add-trip");
  }, [router]);

  const renderTrip = useCallback(
    ({ item, index }: { item: Trip; index: number }) => (
      <AnimatedTripCard
        trip={item}
        index={index}
        onPress={handleTripPress}
        onDelete={handleDeleteTrip}
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

      <Animated.FlatList
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
        itemLayoutAnimation={LinearTransition.springify()}
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

      <AnimatedFab onPress={handleAddTrip} />
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
});
