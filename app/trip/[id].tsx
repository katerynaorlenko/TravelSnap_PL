import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import RatingStars from "@/components/RatingStars";
import { Colors } from "@/constants/Colors";
import { useTrips } from "@/context/TripContext";
import { useFavorites } from "@/hooks/useFavorites";

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips, deleteTrip } = useTrips();
  const router = useRouter();
  const { isLoading, isFavorite, toggleFavorite } = useFavorites();

  const trip = trips.find((t) => t.id === id);
  const favorited = isFavorite(id);

  const handleDelete = () => {
    Alert.alert("Usuń podróż", "Tej operacji nie można cofnąć. Czy na pewno?", [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Usuń",
        style: "destructive",
        onPress: async () => {
          if (id) {
            await deleteTrip(id);
            router.back();
          }
        },
      },
    ]);
  };

  if (!trip) {
    return (
      <>
        <Stack.Screen options={{ title: "Trip not found" }} />
        <View style={styles.screen}>
          <Text style={styles.errorText}>Trip not found.</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back to list</Text>
          </Pressable>
        </View>
      </>
    );
  }

  const { title, destination, date, rating, imageUri } = trip;

  return (
    <>
      <Stack.Screen
        options={{
          title,
          headerBackTitle: "Back",
          headerRight: () =>
            isLoading ? (
              <View style={styles.heartButton}>
                <ActivityIndicator size="small" color={Colors.textSecondary} />
              </View>
            ) : (
              <Pressable
                onPress={() => toggleFavorite(id)}
                style={styles.heartButton}
              >
                <Ionicons
                  name={favorited ? "heart" : "heart-outline"}
                  size={24}
                  color={favorited ? Colors.accent : Colors.textSecondary}
                />
              </Pressable>
            ),
        }}
      />

      <View style={styles.screen}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.heroImage} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={64} color={Colors.primary} />
            <Text style={styles.placeholderText}>Brak zdjęcia</Text>
          </View>
        )}

        <Text style={styles.tripTitle}>{title}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="location" size={16} color={Colors.textSecondary} />
          <Text style={styles.metaText}>{destination}</Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="calendar" size={14} color={Colors.textSecondary} />
          <Text style={[styles.metaText, styles.dateText]}>{date}</Text>
        </View>

        <View style={styles.starsRow}>
          <RatingStars rating={rating} />
        </View>

        <Pressable
          style={styles.editButton}
          onPress={() => router.push(`/trip/edit/${id}`)}
        >
          <Ionicons name="create-outline" size={18} color={Colors.background} />
          <Text style={styles.editButtonText}>Edit trip</Text>
        </Pressable>

        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color={Colors.textPrimary} />
          <Text style={styles.deleteButtonText}>Usuń podróż</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  heroImage: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    marginBottom: 20,
  },
  placeholder: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.card,
    marginBottom: 20,
  },
  placeholderText: {
    color: Colors.textSecondary,
    marginTop: 8,
    fontSize: 14,
  },
  tripTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  dateText: {
    fontSize: 14,
  },
  starsRow: {
    marginTop: 16,
    marginBottom: 32,
  },
  editButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  editButtonText: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  deleteButtonText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },
  heartButton: {
    marginRight: 8,
    padding: 4,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  backButtonText: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
});
