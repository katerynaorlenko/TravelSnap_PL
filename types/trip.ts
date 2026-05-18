export type TripCategory = "Beach" | "City" | "Mountains" | "Adventure";

export interface TripData {
  title: string;
  destination: string;
  date: string;
  rating: number;
  imageUri?: string;
  notes?: string;
  category?: TripCategory;
}

export interface Trip extends TripData {
  id: string;
}
