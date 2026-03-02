import axios from 'axios';
import { Polymer, PolymerPage, PolymerQueryParams, CreatePolymerRequest } from '../types';

const API_URL = 'http://192.168.50.235:8191/api/polymers';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Kluczowe dla Twojego @CrossOrigin
});

export const polymerService = {
  getAll: async (params: PolymerQueryParams) => {
    const { data } = await apiClient.get<PolymerPage>('', { params });
    return data;
  },
  getById: async (id: number) => {
    const { data } = await apiClient.get<Polymer>(`/${id}`);
    return data;
  },
  create: async (payload: CreatePolymerRequest) => {
    const { data } = await apiClient.post<Polymer>('', payload);
    return data;
  },
  update: async (id: number, payload: CreatePolymerRequest) => {
    const { data } = await apiClient.put<Polymer>(`/${id}`, payload);
    return data;
  },
  delete: async (id: number) => {
    await apiClient.delete(`/${id}`);
  }
};