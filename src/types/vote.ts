export interface Country {
  nameJa: string;
  nameEn: string;
  description: string;
  image: string;
  key: string;
}

import type { FieldValue } from "firebase/firestore";

export interface VoteData {
  userId: string;
  userEmail: string | null;
  votedCountry: string;
  role: "user" | "admin";
  createdAt: FieldValue;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

export interface SelectedCountry {
  nameJa: string;
  nameEn: string;
  key: string;
} 