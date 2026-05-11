import { useMemo } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { UNSPLASH_ACCESS_KEY, UNSPLASH_BASE_URL } from "@/constants/api";
import { useFetch } from "@/hooks/useFetch";
import type { UnsplashResponse } from "@/types/unsplash";

interface DestinationCardProps {
  city: string;
}

export default function DestinationCard({ city }: DestinationCardProps) {
  const url = `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(
    city,
  )}&per_page=1`;

  const init = useMemo(
    () => ({
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }),
    [],
  );

  const { data, loading, error } = useFetch<UnsplashResponse>(url, init);

  if (loading) {
    return (
      <View style={styles.skeleton}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (error || !data || !data.results || data.results.length === 0) {
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
