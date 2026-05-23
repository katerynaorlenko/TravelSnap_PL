import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
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
        <View style={styles.emptyScreen}>
          <Text style={styles.errorText}>Trip not found.</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back to list</Text>
          </Pressable>
        </View>
      </>
    );
  }

  const { title, destination, date, rating, imageUri, category, notes } = trip;

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

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.heroImage}
            placeholder={{ blurhash: "LGF5]+Yk^6#M@-5c,1J5@[or[Q6." }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={300}
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={64} color={Colors.primary} />
            <Text style={styles.placeholderText}>Brak zdjęcia</Text>
          </View>
        )}

        <Text style={styles.tripTitle}>{title}</Text>

        {category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}

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

        {notes ? (
          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>Travel notes</Text>
            <Text style={styles.notesText}>{notes}</Text>
          </View>
        ) : null}

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
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyScreen: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
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
    marginBottom: 10,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
  },
  categoryText: {
    color: Colors.background,
    fontSize: 13,
    fontWeight: "700",
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
    marginBottom: 20,
  },
  notesBox: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  notesTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  notesText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
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
