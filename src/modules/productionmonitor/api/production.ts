import axios from "axios";
import { ProjectOrderMonitor } from "../types";

const BASE_URL = "http://192.168.50.235:8191/api";
const API_URL = `${BASE_URL}/production-orders`;

// Definicja typów dla zależności
export interface ProductionDependencies {
  materials: Array<{ id: number; materialName: string; width: number }>;
  dieCuts: Array<{ id: number; name: string }>;
  polymers: { 
    content: Array<{ id: number; projectId: string; repeatTeeth: number }> 
  };
  inks: Array<{ id: number; colorName: string; inkType: string }>;
}

export const productionService = {
  getAll: async (): Promise<ProjectOrderMonitor[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Zamieniliśmy 'any' na konkretny kształt danych z formularza
  create: async (orderData: Record<string, unknown>): Promise<void> => {
    await axios.post(API_URL, orderData);
  },

  getDependencies: async (): Promise<ProductionDependencies> => {
    const [materials, dieCuts, polymers, inks] = await Promise.all([
      axios.get(`${BASE_URL}/raw-materials`),
      axios.get(`${BASE_URL}/die-cuts`),
      axios.get(`${BASE_URL}/polymers`),
      axios.get(`${BASE_URL}/inks`)
    ]);

    return {
      materials: materials.data,
      dieCuts: dieCuts.data,
      polymers: polymers.data,
      inks: inks.data
    };
  }
};