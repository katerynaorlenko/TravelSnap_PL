import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { useUnsplashQuery } from "@/hooks/useUnsplashQuery";

interface DestinationCardProps {
  city: string;
}

export default function DestinationCard({ city }: DestinationCardProps) {
  const { data, isLoading, isError } = useUnsplashQuery(city);

  if (isLoading) {
    return (
      <View style={styles.skeleton}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (isError || !data?.results?.length) {
    return null;
  }

  const photo = data.results[0];

  return (
    <View style={styles.card}>
      <Image source={{ uri: photo.urls.regular }} style={styles.image} />

      <View style={styles.overlay}>
        <Text style={styles.city}>{city}</Text>
        <Text style={styles.credit}>Photo by {photo.user.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    height: 210,
    borderRadius: 12,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  card: {
    height: 210,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: Colors.card,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  city: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  credit: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
});
