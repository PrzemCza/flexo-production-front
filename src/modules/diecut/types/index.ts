import { Page } from "@/shared/types/api";

export type DieCut = {
  id: number;
  dieNumber: string;
  repeatTeeth: number;
  projectId: number;
  status: "ACTIVE" | "INACTIVE" | "AWAY" | "ARCHIVED";
  machine: string | null;
  storageLocation: string | null;
  createdDate: string;
  notes: string | null;
};

// Używamy generycznego typu z shared
export type DieCutPage = Page<DieCut>;