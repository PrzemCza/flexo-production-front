export interface ProjectOrderMonitor {
  id: number;
  orderNumber: string;
  jobName: string;
  targetMachine: string;
  status: string;
  deadline: string;
  
  // Flagi gotowości z Twojego serwisu
  isRawMaterialReady: boolean;
  isDieCutReady: boolean;
  isPolymerReady: boolean;
  isInksReady: boolean;
  
  // Postęp farb np. "2/5"
  inksProgress: string;
}