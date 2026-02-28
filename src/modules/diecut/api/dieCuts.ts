import axios from "axios";
import { API_URL } from "@/config"; 
import { Page } from "@/shared/types/api"; // Wspólny typ dla stron


// Interfejs dla parametrów wyszukiwania (można go też przenieść do types/index.ts)
export interface DieCutQueryParams {
  page?: number;
  size?: number;
  status?: string;
  projectId?: number;
  dieNumber?: string;
  machine?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
  sort?: string;
}

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

export type DieCutPage = Page<DieCut>;

// Typ dla tworzenia i aktualizacji
export type DieCutCreatePayload = Omit<DieCut, "id" | "createdDate" | "storageLocation" | "notes"> & {
  storageLocation?: string;
  notes?: string;
};

export type DieCutUpdatePayload = Omit<DieCut, "id" | "createdDate">;

// FUNKCJE API
export async function fetchDieCuts(params: DieCutQueryParams) {
  
  const response = await axios.get<Page<DieCut>>(`${API_URL}/api/die-cuts`, {
    params,
  });
  return response.data;
}

export async function createDieCut(payload: DieCutCreatePayload) {
  const response = await axios.post<DieCut>(`${API_URL}/api/die-cuts`, payload);
  return response.data;
}

export async function getDieCut(id: number) {
  const response = await axios.get<DieCut>(`${API_URL}/api/die-cuts/${id}`);
  return response.data;
}

export async function deleteDieCut(id: number) {
  await axios.delete(`${API_URL}/api/die-cuts/${id}`);
}

export async function updateDieCut(id: number, payload: DieCutUpdatePayload) {
  const response = await axios.put<DieCut>(`${API_URL}/api/die-cuts/${id}`, payload);
  return response.data;
}