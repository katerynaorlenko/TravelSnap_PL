import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { useTrips } from "@/context/TripContext";
import { tripSchema, type TripFormData } from "@/types/tripSchema";

export default function EditTripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips, updateTrip } = useTrips();
  const router = useRouter();

  const trip = trips.find((item) => item.id === id);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      title: trip?.title ?? "",
      destination: trip?.destination ?? "",
      date: trip?.date ?? "",
      rating: trip?.rating ?? 1,
      imageUri: trip?.imageUri,
    },
    mode: "onBlur",
  });

  if (!trip) {
    return (
      <>
        <Stack.Screen options={{ title: "Trip not found" }} />
        <View style={styles.screen}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </>
    );
  }

  const onSubmit = async (data: TripFormData) => {
    await updateTrip(id, data);
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: "Edit Trip" }} />

      <View style={styles.screen}>
        <Text style={styles.title}>Edit trip</Text>

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <View style={styles.field}>
              <TextInput
                style={[styles.input, fieldState.error && styles.inputError]}
                placeholder="Title"
                placeholderTextColor={Colors.textSecondary}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
              {fieldState.error && (
                <Text style={styles.errorText}>{fieldState.error.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="destination"
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <View style={styles.field}>
              <TextInput
                style={[styles.input, fieldState.error && styles.inputError]}
                placeholder="Destination"
                placeholderTextColor={Colors.textSecondary}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
              {fieldState.error && (
                <Text style={styles.errorText}>{fieldState.error.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <View style={styles.field}>
              <TextInput
                style={[styles.input, fieldState.error && styles.inputError]}
                placeholder="Date (YYYY-MM-DD)"
                placeholderTextColor={Colors.textSecondary}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
              {fieldState.error && (
                <Text style={styles.errorText}>{fieldState.error.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="rating"
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <View style={styles.field}>
              <TextInput
                style={[styles.input, fieldState.error && styles.inputError]}
                placeholder="Rating (1-5)"
                placeholderTextColor={Colors.textSecondary}
                value={String(value)}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^1-5]/g, "");
                  onChange(cleaned ? Number(cleaned) : 0);
                }}
                onBlur={onBlur}
                keyboardType="numeric"
              />
              {fieldState.error && (
                <Text style={styles.errorText}>{fieldState.error.message}</Text>
              )}
            </View>
          )}
        />

        <Pressable
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text style={styles.saveButtonText}>Zapisz zmiany</Text>
          )}
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
  field: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.accent,
    borderWidth: 1.5,
  },
  errorText: {
    color: Colors.accent,
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
});
