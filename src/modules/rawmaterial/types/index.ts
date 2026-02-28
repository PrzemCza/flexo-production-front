import { Page } from "@/shared/types/api";

export type RawMaterialStatus = "AVAILABLE" | "IN_USE" | "READY" | "COMPLAINT";

export interface RawMaterial {
  id: number;
  widthMm: number;
  lengthM: number;
  batchNumber: string;
  supplier: string;
  receivedDate: string; // java.sql.Date przyjdzie jako string ISO
  status: RawMaterialStatus;
  warehouseLocation?: string | null;
  assignedMachine?: string;
}

// CreateRawMaterialRequest z backendu
export type RawMaterialCreatePayload = Omit<RawMaterial, "id">;

export type RawMaterialPage = Page<RawMaterial>;

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