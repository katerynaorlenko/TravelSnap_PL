import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DestinationCard from "@/components/DestinationCard";
import { Colors } from "@/constants/Colors";

const POPULAR_DESTINATIONS = [
  "Paris",
  "Rome",
  "Barcelona",
  "Tokyo",
  "New York",
  "London",
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={POPULAR_DESTINATIONS}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Explore destinations</Text>
            <Text style={styles.subtitle}>
              Discover popular travel ideas with live photos from Unsplash.
            </Text>
          </View>
        }
        renderItem={({ item }) => <DestinationCard city={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 96,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
});
