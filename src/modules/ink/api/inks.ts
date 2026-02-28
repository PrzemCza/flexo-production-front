import axios from "axios"; // Lub Twój skonfigurowany klient
import type { Ink, InkPage, InkQueryParams } from "../types";

const API_URL = "/api/inks";

export const fetchInks = async (params: InkQueryParams): Promise<InkPage> => {
  // Jeśli nie masz jeszcze paginacji/filtrowania na backendzie (InkFilter), 
  // ten endpoint po prostu zwróci listę, którą trzeba będzie obsłużyć.
  const response = await axios.get<Ink[]>(API_URL, { params });
  
  // Tymczasowe mapowanie na format strony, jeśli backend zwraca na razie tylko List<InkResponse>
  return {
    content: response.data,
    totalElements: response.data.length,
    totalPages: 1,
    size: 20,
    number: 0
  };
};

export const getInk = async (id: number): Promise<Ink> => {
  const response = await axios.get<Ink>(`${API_URL}/${id}`);
  return response.data;
};

export const createInk = async (data: Omit<Ink, "id">): Promise<Ink> => {
  const response = await axios.post<Ink>(API_URL, data);
  return response.data;
};

export const updateInk = async (id: number, data: Omit<Ink, "id">): Promise<Ink> => {
  const response = await axios.put<Ink>(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteInk = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};