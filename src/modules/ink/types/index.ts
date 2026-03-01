export interface Ink {
  id: number;
  inkColorId: number;
  quantityKg: number;
  storageLocation: string | null;
  batchNumber: string;
  receivedDate: string; // ISO date string
  status: string;
  machine: string | null;
  notes: string | null;
}

export interface InkPage {
  content: Ink[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface InkQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  batchNumber?: string;
  status?: string;
}