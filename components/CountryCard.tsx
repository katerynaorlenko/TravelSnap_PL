import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { RESTCOUNTRIES_BASE_URL } from "@/constants/api";
import { useFetch } from "@/hooks/useFetch";
import type { Country } from "@/types/country";

interface CountryCardProps {
  countryName: string;
}

export default function CountryCard({ countryName }: CountryCardProps) {
  const url = `${RESTCOUNTRIES_BASE_URL}/name/${encodeURIComponent(
    countryName,
  )}`;

  const { data, loading, error } = useFetch<Country[]>(url);

  if (loading) {
    return <View style={styles.skeleton} />;
  }

  if (error || !data?.[0]) {
    return null;
  }

  const country = data[0];
  const currency = country.currencies
    ? Object.values(country.currencies)[0]
    : undefined;

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: country.flags.png }}
        style={styles.flag}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={200}
      />

      <View style={styles.info}>
        <Text style={styles.name}>{country.name.common}</Text>

        <Text style={styles.meta}>Stolica: {country.capital?.[0] ?? "—"}</Text>

        <Text style={styles.meta}>
          Waluta:{" "}
          {currency
            ? `${currency.name} ${currency.symbol ? `(${currency.symbol})` : ""}`
            : "—"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    height: 90,
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  flag: {
    width: 60,
    height: 40,
    borderRadius: 6,
  },
  info: {
    flex: 1,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  meta: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
