import { Link } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";

import AddTripForm from "@/components/AddTripForm";
import ScreenHeader from "@/components/ScreenHeader";
import TripCard from "@/components/TripCard";
import EmptyState from "@/components/ui/EmptyState";
import { Colors } from "@/constants/Colors";
interface Trip {
  id: string;
  title: string;
  destination: string;
  date: string;
  rating: number;
}

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [rating, setRating] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);

  const handleAddTrip = () => {
    if (
      !title.trim() ||
      !destination.trim() ||
      !date.trim() ||
      !rating.trim()
    ) {
      Alert.alert("Błąd", "Wszystkie pola muszą być uzupełnione.");
      return;
    }

    if (!/^\d{4}-\d{2}$/.test(date)) {
      Alert.alert("Błąd", "Data musi mieć format YYYY-MM.");
      return;
    }

    const numericRating = Number(rating);

    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      Alert.alert("Błąd", "Ocena musi być liczbą od 1 do 5.");
      return;
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      title: title.trim(),
      destination: destination.trim(),
      date: date.trim(),
      rating: numericRating,
    };

    setTrips((prev) => [newTrip, ...prev]);

    setTitle("");
    setDestination("");
    setDate("");
    setRating("");
  };

  const handleDeleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <ScreenHeader tripCount={trips.length} />

        <AddTripForm
          title={title}
          destination={destination}
          date={date}
          rating={rating}
          onChangeTitle={setTitle}
          onChangeDestination={setDestination}
          onChangeDate={setDate}
          onChangeRating={setRating}
          onAdd={handleAddTrip}
        />

        {trips.length === 0 ? (
          <EmptyState
            icon="airplane-outline"
            title="Brak podróży"
            subtitle="Dodaj swoją pierwszą podróż!"
          />
        ) : (
          <ScrollView contentContainerStyle={styles.list} scrollEnabled={false}>
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={{
                  pathname: "/trip/[id]",
                  params: {
                    id: trip.id,
                    title: trip.title,
                    destination: trip.destination,
                    date: trip.date,
                    rating: String(trip.rating),
                  },
                }}
                asChild
              >
                <Pressable>
                  <TripCard
                    title={trip.title}
                    destination={trip.destination}
                    date={trip.date}
                    rating={trip.rating}
                    onDelete={() => handleDeleteTrip(trip.id)}
                   
                  />
                </Pressable>
              </Link>
            ))}
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
