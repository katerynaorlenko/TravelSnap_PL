import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Trip, TripData } from "@/types/trip";
import { loadTrips, saveTrips } from "@/utils/tripStorage";

interface TripContextType {
  trips: Trip[];
  loading: boolean;
  addTrip: (data: TripData) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  updateTrip: (id: string, data: Partial<TripData>) => Promise<void>;
}

const TripContext = createContext<TripContextType | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavedTrips = async () => {
      const savedTrips = await loadTrips();
      setTrips(savedTrips);
      setLoading(false);
    };

    loadSavedTrips();
  }, []);

  const addTrip = async (data: TripData) => {
    const newTrip: Trip = {
      ...data,
      id: Date.now().toString(),
    };

    const updatedTrips = [...trips, newTrip];

    setTrips(updatedTrips);
    await saveTrips(updatedTrips);
  };

  const deleteTrip = async (id: string) => {
    const updatedTrips = trips.filter((trip) => trip.id !== id);

    setTrips(updatedTrips);
    await saveTrips(updatedTrips);
  };

  const updateTrip = async (id: string, data: Partial<TripData>) => {
    const updatedTrips = trips.map((trip) =>
      trip.id === id ? { ...trip, ...data } : trip,
    );

    setTrips(updatedTrips);
    await saveTrips(updatedTrips);
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        loading,
        addTrip,
        deleteTrip,
        updateTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);

  if (!context) {
    throw new Error("useTrips must be used inside TripProvider");
  }

  return context;
}
