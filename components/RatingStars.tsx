import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
}

export default function RatingStars({
  rating,
  maxStars = 5,
}: RatingStarsProps) {
  const normalizedRating = Math.max(0, Math.min(rating, maxStars));

  return (
    <View style={styles.row}>
      {Array.from({ length: maxStars }, (_, index) => {
        const starNumber = index + 1;

        return (
          <Ionicons
            key={starNumber}
            name={starNumber <= normalizedRating ? "star" : "star-outline"}
            size={16}
            color={Colors.accent}
            style={styles.star}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  star: {
    marginRight: 4,
  },
});
