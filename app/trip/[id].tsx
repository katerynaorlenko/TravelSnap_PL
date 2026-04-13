import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import RatingStars from "@/components/RatingStars";
import { Colors } from "@/constants/Colors";

export default function TripDetailScreen() {
  const { id, title, destination, date, rating } = useLocalSearchParams<{
    id: string;
    title: string;
    destination: string;
    date: string;
    rating: string;
  }>();

  return (
    <>
      <Stack.Screen
        options={{
          title: title || "Trip Details",
          headerBackTitle: "Back",
        }}
      />

      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.destination}>{destination}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>ID:</Text>
            <Text style={styles.value}>{id}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Data:</Text>
            <Text style={styles.value}>{date}</Text>
          </View>

          <View style={styles.ratingBox}>
            <Text style={styles.label}>Ocena:</Text>
            <RatingStars rating={Number(rating)} />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  destination: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  value: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  ratingBox: {
    marginTop: 8,
  },
});
