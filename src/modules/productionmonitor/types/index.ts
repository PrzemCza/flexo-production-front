export interface ProjectOrderMonitor {
  id: number;
  orderNumber: string;
  jobName: string;
  targetMachine: string;
  status: string;
  deadline: string;

  // Flagi dla Dashboardu (zgodne z Twoim Dashboardem)
  isRawMaterialReady: boolean;
  isDieCutReady: boolean;
  isPolymerReady: boolean;
  isInksReady: boolean;
  
  // Dane tekstowe do Dashboardu
  rawMaterialName: string;
  dieCutName: string;
  polymerName: string;
  inksProgress: string; 
  inkList: string[];

  // KLUCZOWE: Pola ID do edycji w Formularzu (Opcjonalne)
  rawMaterialId?: number;
  dieCutId?: number;
  polymerId?: number;
  inkIds?: number[];
}