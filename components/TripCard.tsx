import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import type { GestureResponderEvent } from "react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import type { Trip } from "@/types/trip";

import RatingStars from "./RatingStars";

interface TripCardProps {
  id: string;
  title: Trip["title"];
  destination: Trip["destination"];
  date: Trip["date"];
  rating: Trip["rating"];
  imageUri?: Trip["imageUri"];
  category?: Trip["category"];
  notes?: Trip["notes"];
  onPress: (id: string) => void;
  onDeleteTrip?: (id: string) => void;
}

const TripCard = React.memo(function TripCard({
  id,
  title,
  destination,
  date,
  rating,
  imageUri,
  category,
  notes,
  onPress,
  onDeleteTrip,
}: TripCardProps) {
  const handleDeletePress = (event: GestureResponderEvent): void => {
    event.stopPropagation();
    onDeleteTrip?.(id);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.75 : 1 }]}
      onPress={() => onPress(id)}
    >
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.cardImage}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
        />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          {onDeleteTrip && (
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

        <Text style={styles.meta} numberOfLines={1}>
          {destination} | {date}
        </Text>

        {notes ? (
          <Text style={styles.notes} numberOfLines={2}>
            {notes}
          </Text>
        ) : null}

        <View style={styles.separator} />

        <RatingStars rating={rating} />
      </View>
    </Pressable>
  );
});

export default TripCard;

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
