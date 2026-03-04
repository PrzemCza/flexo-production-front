import axios from "axios";
import { ProjectOrderMonitor } from "../types";

const BASE_URL = "http://192.168.50.235:8191/api";
const API_URL = `${BASE_URL}/production-orders`;

export interface ProductionOrderRequest {
  orderNumber: string;
  jobName: string;
  targetMachine: string;
  deadline: string;
  rawMaterialId: number | "";
  dieCutId: number | "";
  polymerId: number | "";
  inkIds: number[];
}

export const productionService = {
  // Pobieranie wszystkich zleceń (Monitor)
  getAll: async (): Promise<ProjectOrderMonitor[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Pobieranie jednego zlecenia do edycji
  getById: async (id: number): Promise<ProjectOrderMonitor> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Tworzenie nowego zlecenia
  create: async (orderData: ProductionOrderRequest): Promise<void> => {
    // Poprawione: wywalamy zbędne /production-orders z adresu
    await axios.post(API_URL, orderData);
  },

  // Aktualizacja istniejącego zlecenia (PUT)
  update: async (id: number, orderData: ProductionOrderRequest): Promise<void> => {
    // Poprawione: API_URL już zawiera "production-orders"
    await axios.put(`${API_URL}/${id}`, orderData);
  },

  // Usuwanie zlecenia
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};