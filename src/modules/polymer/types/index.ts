export interface Polymer {
  id: number;
  projectId: number;
  repeatTeeth: number;
  lengthMm: number;
  widthMm: number;
  colorId: number | null;
  status: string; 
  storageLocation: string | null;
  createdDate: string;
  notes: string | null;
  machine: string | null;
}

export interface CreatePolymerRequest {
  projectId: number;
  repeatTeeth: number;
  lengthMm: number;
  widthMm: number;
  colorId?: number | null;
  status: string;
  storageLocation?: string | null;
  notes?: string | null;
  machine?: string | null;
}

export interface PolymerPage {
  content: Polymer[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export interface PolymerQueryParams {
  page?: number;
  size?: number;
  projectId?: number;
}