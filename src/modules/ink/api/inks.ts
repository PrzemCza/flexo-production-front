import axios from "axios"; // Lub Twój skonfigurowany klient
import type { Ink, InkPage, InkQueryParams } from "../types";

const API_URL = "http://192.168.50.235:8191/api/inks";

export const fetchInks = async (params: InkQueryParams): Promise<InkPage> => {
  const response = await axios.get(API_URL, { params });
  const data = response.data;

  // Sprawdzamy, czy backend zwrócił obiekt z polem 'content' (paginacja Springa)
  if (data && Array.isArray(data.content)) {
    return data;
  }

  // Jeśli backend zwrócił po prostu tablicę, pakujemy ją w strukturę InkPage
  if (Array.isArray(data)) {
    return {
      content: data,
      totalElements: data.length,
      totalPages: 1,
      size: data.length,
      number: 0,
    };
  }

  // Zabezpieczenie na wypadek pustej odpowiedzi lub błędu struktury
  return {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 20,
    number: 0,
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