import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import type { TripData } from "@/types/trip";
import {
  tripCategories,
  tripSchema,
  type TripFormData,
} from "@/types/tripSchema";
import { saveImage } from "@/utils/saveImage";

interface AddTripFormProps {
  onAdd: (trip: TripData) => void | Promise<void>;
}

export default function AddTripForm({ onAdd }: AddTripFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      title: "",
      destination: "",
      date: "",
      rating: 3,
      imageUri: undefined,
      notes: "",
      category: "City",
    },
    mode: "onBlur",
  });

  const imageUri = watch("imageUri");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      const savedUri = await saveImage(result.assets[0].uri);
      setValue("imageUri", savedUri, { shouldDirty: true });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Brak uprawnień", "Potrzebujemy dostępu do kamery");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const savedUri = await saveImage(result.assets[0].uri);
      setValue("imageUri", savedUri, { shouldDirty: true });
    }
  };

  const handleAddPhoto = () => {
    Alert.alert("Dodaj zdjęcie", "Wybierz źródło", [
      { text: "Galeria", onPress: pickImage },
      { text: "Kamera", onPress: takePhoto },
      { text: "Anuluj", style: "cancel" },
    ]);
  };

  const onSubmit = async (data: TripFormData) => {
    await onAdd(data);
    reset();
  };

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>Add new trip</Text>

      {imageUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          <Pressable onPress={handleAddPhoto}>
            <Text style={styles.changeButton}>Zmień zdjęcie</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.imagePicker} onPress={handleAddPhoto}>
          <Text style={styles.pickerIcon}>📷</Text>
          <Text style={styles.pickerText}>Dodaj zdjęcie</Text>
        </Pressable>
      )}

      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Tytuł</Text>
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
            <Text style={styles.label}>Cel podróży</Text>
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
            <Text style={styles.label}>Data</Text>
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
            <Text style={styles.label}>Ocena</Text>
            <TextInput
              style={[styles.input, fieldState.error && styles.inputError]}
              placeholder="Rating (1-5)"
              placeholderTextColor={Colors.textSecondary}
              value={String(value)}
              onChangeText={(text) => onChange(Number(text))}
              onBlur={onBlur}
              keyboardType="numeric"
            />
            {fieldState.error && (
              <Text style={styles.errorText}>{fieldState.error.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="category"
        render={({ field: { value, onChange } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryRow}>
              {tripCategories.map((category) => (
                <Pressable
                  key={category}
                  style={[
                    styles.categoryChip,
                    value === category && styles.categoryChipActive,
                  ]}
                  onPress={() => onChange(category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      value === category && styles.categoryTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Travel notes</Text>
            <TextInput
              style={[
                styles.input,
                styles.notesInput,
                fieldState.error && styles.inputError,
              ]}
              placeholder="Write a short note about this trip..."
              placeholderTextColor={Colors.textSecondary}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
            />
            {fieldState.error && (
              <Text style={styles.errorText}>{fieldState.error.message}</Text>
            )}
          </View>
        )}
      />

      <Pressable
        style={[styles.addButton, isSubmitting && styles.addButtonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color={Colors.textPrimary} />
        ) : (
          <Text style={styles.addButtonText}>Add Trip</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.textPrimary,
  },
  imagePicker: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  pickerIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  pickerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  previewContainer: {
    marginBottom: 12,
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  changeButton: {
    color: Colors.primary,
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  field: {
    marginBottom: 12,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
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
  notesInput: {
    height: 90,
    textAlignVertical: "top",
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
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.inputBg,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: Colors.background,
  },
  addButton: {
    backgroundColor: Colors.accent,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },
});
