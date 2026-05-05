import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { useTrips } from "@/context/TripContext";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export default function EditTripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips, updateTrip } = useTrips();
  const router = useRouter();

  const trip = trips.find((item) => item.id === id);

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    if (trip) {
      setTitle(trip.title);
      setDestination(trip.destination);
      setDate(trip.date);
      setRating(String(trip.rating));
    }
  }, [trip]);

  const handleSave = async () => {
    if (
      !title.trim() ||
      !destination.trim() ||
      !date.trim() ||
      !rating.trim()
    ) {
      Alert.alert("Błąd", "Wszystkie pola są wymagane.");
      return;
    }

    if (!DATE_REGEX.test(date)) {
      Alert.alert("Błąd", "Data musi mieć format YYYY-MM-DD.");
      return;
    }

    const numericRating = Number(rating);

    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      Alert.alert("Błąd", "Ocena musi być liczbą od 1 do 5.");
      return;
    }

    if (id) {
      await updateTrip(id, {
        title: title.trim(),
        destination: destination.trim(),
        date: date.trim(),
        rating: numericRating,
      });

      router.back();
    }
  };

  if (!trip) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Trip not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Edit Trip" }} />

      <View style={styles.screen}>
        <Text style={styles.title}>Edit trip</Text>

        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor={Colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Destination"
          placeholderTextColor={Colors.textSecondary}
          value={destination}
          onChangeText={setDestination}
        />

        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          placeholderTextColor={Colors.textSecondary}
          value={date}
          onChangeText={setDate}
        />

        <TextInput
          style={styles.input}
          placeholder="Rating (1-5)"
          placeholderTextColor={Colors.textSecondary}
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
        />

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Zapisz zmiany</Text>
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
  title: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
});
