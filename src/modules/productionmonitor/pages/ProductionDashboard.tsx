import { useEffect, useState } from "react";
import { productionService } from "../api/production";
import { ProjectOrderMonitor } from "../types/index";

export default function ProductionDashboard() {
  const [orders, setOrders] = useState<ProjectOrderMonitor[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await productionService.getAll();
      setOrders(data);
    } catch (error) {
      console.error("Błąd podczas pobierania danych monitoringu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // Automatyczne odświeżanie co 30 sekund
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatusDot = ({ ready, label }: { ready: boolean; label: string }) => (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-4 h-4 rounded-full shadow-sm transition-all duration-500 ${
        ready ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-red-500 shadow-red-500/50'
      }`} />
      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{label}</span>
    </div>
  );

  if (loading) return <div className="p-8 text-slate-400 animate-pulse font-medium">Inicjalizacja monitoringu produkcji...</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Production Monitor</h1>
          <p className="text-slate-400 text-sm">Podgląd gotowości komponentów dla maszyn</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700 backdrop-blur-md">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          Live Update Active
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-widest">
              <th className="p-4">Zlecenie / Praca</th>
              <th className="p-4">Maszyna</th>
              <th className="p-4 text-center">Statusy Gotowości</th>
              <th className="p-4 text-right">Termin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {orders.map(order => {
              // Logika sprawdzająca, czy absolutnie wszystko jest gotowe
              const isFullOrderReady = 
                order.isRawMaterialReady && 
                order.isDieCutReady && 
                order.isPolymerReady && 
                order.isInksReady;

              return (
                <tr key={order.id} className="hover:bg-slate-700/20 transition-colors group">
                  <td className="p-4">
                    <div className={`font-bold transition-colors ${isFullOrderReady ? 'text-emerald-400' : 'text-indigo-400'}`}>
                      {order.orderNumber} {isFullOrderReady && <span className="ml-1 text-emerald-500">✓</span>}
                    </div>
                    <div className="text-sm text-slate-300 group-hover:text-white transition-colors">{order.jobName}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-slate-900 text-slate-100 rounded-md border border-slate-700 font-mono text-sm">
                      {order.targetMachine}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-8">
                      <StatusDot ready={order.isRawMaterialReady} label="Surowiec" />
                      <StatusDot ready={order.isInksReady} label={`Farby (${order.inksProgress})`} />
                      <StatusDot ready={order.isDieCutReady} label="Wykrojnik" />
                      <StatusDot ready={order.isPolymerReady} label="Polimer" />
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-sm font-medium text-slate-300">{order.deadline}</div>
                    <div className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded inline-block ${
                      isFullOrderReady ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {isFullOrderReady ? 'READY TO PRINT' : order.status}
                    </div>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={4} className="p-12 text-center text-slate-500 italic">
                  Brak aktywnych zleceń w systemie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}