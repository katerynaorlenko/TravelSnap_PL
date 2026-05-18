import { Ionicons } from "@expo/vector-icons";
import type { GestureResponderEvent } from "react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import type { TripData } from "@/types/trip";

import RatingStars from "./RatingStars";

interface TripCardProps extends TripData {
  onDelete?: () => void;
}

export default function TripCard({
  title,
  destination,
  date,
  rating,
  imageUri,
  category,
  notes,
  onDelete,
}: TripCardProps) {
  const handleDeletePress = (event: GestureResponderEvent): void => {
    event.stopPropagation();
    onDelete?.();
  };

  return (
    <View style={styles.card}>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.cardImage} />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>

          {onDelete && (
            <Pressable onPress={handleDeletePress} style={styles.deleteButton}>
              <Ionicons name="close" size={16} color={Colors.accent} />
            </Pressable>
          )}
        </View>

        {category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}

        <Text style={styles.meta}>
          {destination} | {date}
        </Text>

        {notes ? <Text style={styles.notes}>{notes}</Text> : null}

        <View style={styles.separator} />

        <RatingStars rating={rating} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: Colors.accentTransparent,
    padding: 6,
    borderRadius: 12,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  categoryText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: "700",
  },
  meta: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  notes: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginVertical: 12,
  },
});
