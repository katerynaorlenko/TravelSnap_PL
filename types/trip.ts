export type TripCategory = "Beach" | "City" | "Mountains" | "Adventure";

export interface TripCoordinates {
  latitude: number;
  longitude: number;
}

export interface TripData {
  title: string;
  destination: string;
  date: string;
  rating: number;
  imageUri?: string;
  notes?: string;
  category?: TripCategory;
  coordinates?: TripCoordinates;
}

export interface Trip extends TripData {
  id: string;
}
