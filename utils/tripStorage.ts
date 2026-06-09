import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Trip } from "@/types/trip";

const STORAGE_KEY = "travelsnap_trips";

export async function saveTrips(trips: Trip[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (error) {
    console.error("Błąd zapisu podróży:", error);
  }
}

export async function loadTrips(): Promise<Trip[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);

    return json ? (JSON.parse(json) as Trip[]) : [];
  } catch (error) {
    console.error("Błąd odczytu podróży:", error);
    return [];
  }
}

export async function clearTrips(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Błąd usuwania podróży:", error);
  }
}
