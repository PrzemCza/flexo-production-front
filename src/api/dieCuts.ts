import axios from "axios";
import { API_URL } from "../config";

export type DieCut = {
  id: number;
  dieNumber: string;
  repeatTeeth: number;
  projectId: number;
  status: string;
  machine: string | null;
  storageLocation: string | null;
  createdDate: string;
  notes: string | null;
};

export type DieCutPage = {
  content: DieCut[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export async function fetchDieCuts(params: {
  page?: number;
  size?: number;
  status?: string;
  projectId?: number;
  dieNumber?: string;
  machine?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
  sort?: string;
}) {

  const response = await axios.get<DieCutPage>(`${API_URL}/api/die-cuts`, {
    params,
  });
  return response.data;
}

export async function createDieCut(payload: {
  dieNumber: string;
  repeatTeeth: number;
  projectId: number;
  status: string;
  storageLocation?: string;
  notes?: string;
}) {
  const response = await axios.post(`${API_URL}/api/die-cuts`, payload);
  return response.data;
}
export async function getDieCut(id: number) {
  const response = await axios.get(`${API_URL}/api/die-cuts/${id}`);
  return response.data;
}

export async function deleteDieCut(id: number) {
  await axios.delete(`${API_URL}/api/die-cuts/${id}`);
}

type DieCutUpdatePayload = Omit<DieCut, "id" | "createdDate">;

export async function updateDieCut(id: number, payload: DieCutUpdatePayload) {
  const response = await axios.put(`${API_URL}/api/die-cuts/${id}`, payload);
  return response.data;
}
