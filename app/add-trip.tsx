import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import AddTripForm from "@/components/AddTripForm";
import { Colors } from "@/constants/Colors";
import { useTrips } from "@/context/TripContext";
import type { TripData } from "@/types/trip";

export default function AddTripScreen() {
  const router = useRouter();
  const { addTrip } = useTrips();

  const handleAddTrip = async (data: TripData) => {
    await addTrip(data);
    router.back();
  };

  return (
    <View style={styles.screen}>
      <AddTripForm onAdd={handleAddTrip} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
});
