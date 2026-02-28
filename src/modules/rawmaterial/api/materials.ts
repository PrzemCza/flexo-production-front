import axios from "axios";
import { API_URL } from "@/config";
import { RawMaterial, RawMaterialCreatePayload, RawMaterialPage } from "../types";

const BASE_URL = `${API_URL}/api/raw-materials`;

// 1. Definiujemy typ dla parametrów wyszukiwania (zgodnie z Controllerem)
export interface RawMaterialQueryParams {
  status?: string;
  batchNumber?: string;
  supplier?: string;
  widthMm?: number;
  lengthM?: number;
  page?: number;
  size?: number;
  sort?: string;
}

// 2. Podstawiamy typ zamiast 'any'
export const fetchMaterials = async (params: RawMaterialQueryParams) => {
  const response = await axios.get<RawMaterialPage>(`${BASE_URL}/search`, { params });
  return response.data;
};

export const getMaterial = async (id: number) => {
  const response = await axios.get<RawMaterial>(`${BASE_URL}/${id}`);
  return response.data;
};

export const createMaterial = async (payload: RawMaterialCreatePayload) => {
  const response = await axios.post<RawMaterial>(BASE_URL, payload);
  return response.data;
};

export const updateMaterial = async (id: number, payload: RawMaterialCreatePayload) => {
  const response = await axios.put<RawMaterial>(`${BASE_URL}/${id}`, payload);
  return response.data;
};

export const deleteMaterial = async (id: number) => {
  await axios.delete(`${BASE_URL}/${id}`);
};