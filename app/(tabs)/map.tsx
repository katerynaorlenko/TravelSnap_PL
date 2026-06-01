import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import {
    ActivityIndicator,
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";

import { Colors } from "@/constants/Colors";
import { useTrips } from "@/context/TripContext";
import { useLocation } from "@/hooks/useLocation";

const DEFAULT_REGION = {
  latitude: 52.2297,
  longitude: 21.0122,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const { trips } = useTrips();
  const { location, loading, error } = useLocation();

  const tripsWithCoords = useMemo(
    () => trips.filter((trip) => trip.coordinates),
    [trips],
  );

  const initialRegion = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }
    : DEFAULT_REGION;

  useEffect(() => {
    const coords = tripsWithCoords.map((trip) => trip.coordinates!);

    if (coords.length === 0 || !mapRef.current) return;

    if (coords.length === 1) {
      mapRef.current.animateToRegion(
        {
          ...coords[0],
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000,
      );
      return;
    }

    mapRef.current.fitToCoordinates(coords, {
      edgePadding: {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60,
      },
      animated: true,
    });
  }, [tripsWithCoords]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Ładowanie mapy...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            style={styles.settingsButton}
            onPress={Linking.openSettings}
          >
            <Text style={styles.settingsButtonText}>Otwórz ustawienia</Text>
          </Pressable>
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={!error}
      >
        {tripsWithCoords.map((trip) => (
          <Marker
            key={trip.id}
            coordinate={trip.coordinates!}
            tracksViewChanges={false}
          >
            <View style={styles.customMarker}>
              {trip.imageUri ? (
                <Image
                  source={{ uri: trip.imageUri }}
                  style={styles.markerImage}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
              ) : (
                <View style={styles.markerFallback}>
                  <Text style={styles.markerFallbackText}>
                    {trip.title.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            <Callout onPress={() => router.push(`/trip/${trip.id}`)}>
              <View style={styles.calloutContainer}>
                {trip.imageUri ? (
                  <Image
                    source={{ uri: trip.imageUri }}
                    style={styles.calloutImage}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                  />
                ) : null}

                <View style={styles.calloutText}>
                  <Text style={styles.calloutTitle}>{trip.title}</Text>
                  <Text style={styles.calloutDestination}>
                    {trip.destination}
                  </Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: Colors.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },
  errorBox: {
    position: "absolute",
    top: 48,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    color: Colors.textPrimary,
    fontSize: 14,
    marginBottom: 8,
  },
  settingsButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  settingsButtonText: {
    color: Colors.background,
    fontWeight: "bold",
  },
  customMarker: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  markerImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  markerFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  markerFallbackText: {
    color: Colors.background,
    fontWeight: "bold",
  },
  calloutContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    maxWidth: 220,
  },
  calloutImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  calloutText: {
    flexShrink: 1,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  calloutDestination: {
    fontSize: 12,
  },
});
