import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Colors } from "@/constants/Colors";

interface AddTripFormProps {
  title: string;
  destination: string;
  date: string;
  rating: string;
  onChangeTitle: (value: string) => void;
  onChangeDestination: (value: string) => void;
  onChangeDate: (value: string) => void;
  onChangeRating: (value: string) => void;
  onAdd: () => void;
}

export default function AddTripForm({
  title,
  destination,
  date,
  rating,
  onChangeTitle,
  onChangeDestination,
  onChangeDate,
  onChangeRating,
  onAdd,
}: AddTripFormProps) {
  return (
    <View style={styles.card}>
      <TextInput
        style={styles.input}
        placeholder="Tytuł podróży..."
        placeholderTextColor={Colors.textSecondary}
        value={title}
        onChangeText={onChangeTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Destynacja..."
        placeholderTextColor={Colors.textSecondary}
        value={destination}
        onChangeText={onChangeDestination}
      />

      <TextInput
        style={styles.input}
        placeholder="Data (YYYY-MM)..."
        placeholderTextColor={Colors.textSecondary}
        value={date}
        onChangeText={onChangeDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Ocena (1-5)..."
        placeholderTextColor={Colors.textSecondary}
        value={rating}
        onChangeText={onChangeRating}
        keyboardType="numeric"
      />

      <Pressable style={styles.button} onPress={onAdd}>
        <Text style={styles.buttonText}>Dodaj podróż</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 12,
    padding: 14,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },
});
