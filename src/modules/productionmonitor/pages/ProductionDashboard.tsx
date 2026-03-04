import { useEffect, useState } from "react";
import { productionService } from "../api/production";
import { ProjectOrderMonitor } from "../types/index";
import { useNavigate } from "react-router-dom";

interface StatusDotProps {
  ready: boolean;
  label: string;
  detail?: string | string[];
}

export default function ProductionDashboard() {
  const [orders, setOrders] = useState<ProjectOrderMonitor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<ProjectOrderMonitor | null>(null);
  const navigate = useNavigate();

  const loadOrders = async (): Promise<void> => {
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
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleEdit = (id: number, e?: React.MouseEvent): void => {
    if (e) e.stopPropagation();
    navigate(`/production-monitor/edit/${id}`);
  };

  const handleDelete = async (id: number, e?: React.MouseEvent): Promise<void> => {
    if (e) e.stopPropagation();
    if (window.confirm("Czy na pewno chcesz usunąć to zlecenie?")) {
      try {
        await productionService.delete(id);
        if (selectedOrder?.id === id) setSelectedOrder(null);
        await loadOrders();
      } catch (error) {
        console.error("Błąd podczas usuwania:", error);
      }
    }
  };

  const StatusDot = ({ ready, label, detail }: StatusDotProps) => {
    const getDetailText = (): string => {
      if (Array.isArray(detail)) {
        return detail.length > 0 ? detail.join(", ") : "Brak przypisanych pozycji";
      }
      return detail && detail.trim() !== "" ? detail : "Brak danych";
    };

    const detailText = getDetailText();

    return (
      // Dodano group-hover:z-50, aby aktywny tooltip był zawsze na wierzchu pozostałych krotek
      <div className="flex flex-col items-center gap-1 group relative hover:z-50">
        <div className={`w-4 h-4 rounded-full shadow-sm transition-all duration-500 cursor-help ${
          ready ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-red-500 shadow-red-500/50'
        }`} />
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{label}</span>
        
        {/* Poprawiony Tooltip - dodano pointer-events-none i wyższy z-index */}
        <div className="absolute bottom-full mb-3 hidden group-hover:block z-[100] animate-in fade-in zoom-in duration-200 pointer-events-none">
          <div className="bg-slate-900 text-white text-[11px] p-2.5 rounded-xl border border-slate-700 shadow-2xl whitespace-nowrap min-w-[140px] text-center backdrop-blur-md">
            <span className="text-slate-500 font-black uppercase text-[8px] block mb-1 tracking-widest">{label}</span> 
            <span className={detailText !== "Brak danych" ? "text-indigo-300 font-bold" : "text-slate-600 italic"}>
              {detailText}
            </span>
          </div>
          <div className="w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700 rotate-45 mx-auto -mt-1.5" />
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-8 text-slate-400 animate-pulse font-bold tracking-widest text-center">ŁADOWANIE MONITORA...</div>;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200">
      <div className={`p-6 transition-all duration-500 ${selectedOrder ? 'pr-[420px]' : ''}`}>
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              Production <span className="text-indigo-500 not-italic">Monitor</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Operational Readiness System</p>
          </div>
          <button 
            onClick={() => navigate('/production-monitor/new')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
          >
            + Nowe Zlecenie
          </button>
        </div>

        {/* TABELA */}
        <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl overflow-visible backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[9px] uppercase font-black tracking-[0.2em]">
                <th className="p-6">Zlecenie / Klient</th>
                <th className="p-6">Maszyna</th>
                <th className="p-6 text-center">Status Komponentów</th>
                <th className="p-6 text-right">Termin</th>
                <th className="p-6 text-center">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {orders.map(order => (
                <tr 
                  key={order.id} 
                  onClick={() => setSelectedOrder(order)}
                  className={`transition-all cursor-pointer group ${
                    selectedOrder?.id === order.id ? 'bg-indigo-600/10' : 'hover:bg-white/5'
                  }`}
                >
                  <td className="p-6">
                    <div className="font-black text-white text-base group-hover:text-indigo-400 transition-colors">{order.orderNumber}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-tight">{order.jobName}</div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1.5 bg-slate-950 text-indigo-400 rounded-lg border border-indigo-500/20 font-mono text-[10px] font-black">
                      {order.targetMachine}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-10">
                      <StatusDot ready={order.isRawMaterialReady} label="Mat" detail={order.rawMaterialName} />
                      <StatusDot ready={order.isInksReady} label="Inks" detail={order.inkList} />
                      <StatusDot ready={order.isDieCutReady} label="Die" detail={order.dieCutName} />
                      <StatusDot ready={order.isPolymerReady} label="Pol" detail={order.polymerName} />
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="text-sm font-black text-slate-200">{order.deadline}</div>
                    <div className="text-[9px] font-black uppercase text-amber-500 tracking-widest">{order.status}</div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => handleEdit(order.id, e)} className="p-2 hover:bg-indigo-500/20 rounded-lg text-slate-400 hover:text-indigo-400 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOCZNY PANEL - NAPRAWIONE WYŚWIETLANIE KOMPONENTÓW */}
      {selectedOrder && (
        <div className="fixed inset-y-0 right-0 w-[400px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 animate-in slide-in-from-right duration-300">
          <div className="flex flex-col h-full">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
              <div>
                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">Karta Techniczna</p>
                <h2 className="text-2xl font-black text-white uppercase">{selectedOrder.orderNumber}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-500 hover:text-white p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Sekcja: SUROWIEC */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Surowiec / Materiał</p>
                <p className="text-slate-200 font-bold text-lg">{selectedOrder.rawMaterialName || "Nie przypisano"}</p>
                <div className={`mt-3 inline-flex items-center gap-2 text-[10px] font-bold ${selectedOrder.isRawMaterialReady ? 'text-emerald-500' : 'text-red-500'}`}>
                   <div className={`w-2 h-2 rounded-full ${selectedOrder.isRawMaterialReady ? 'bg-emerald-500' : 'bg-red-500'}`} />
                   {selectedOrder.isRawMaterialReady ? 'GOTOWY W MAGAZYNIE' : 'BRAK / DO ZAMÓWIENIA'}
                </div>
              </div>

              {/* Sekcja: WYKROJNIK */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Narzędzie: Wykrojnik</p>
                <p className="text-slate-200 font-bold text-lg">{selectedOrder.dieCutName || "Nie przypisano"}</p>
                <p className="text-xs text-slate-500 mt-1 italic">Weryfikacja techniczna wymagana</p>
              </div>

              {/* Sekcja: POLIMER */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Formy: Polimer</p>
                <p className="text-slate-200 font-bold text-lg">{selectedOrder.polymerName || "Nie przypisano"}</p>
              </div>

              {/* Sekcja: FARBY */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Zestawienie Kolorystyczne</p>
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.inkList && selectedOrder.inkList.length > 0 ? (
                    selectedOrder.inkList.map((ink, i) => (
                      <span key={i} className="px-3 py-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black rounded-lg uppercase">
                        {ink}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-600 text-xs italic italic">Brak wybranych kolorów</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md grid grid-cols-2 gap-4">
              <button onClick={() => handleEdit(selectedOrder.id)} className="bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/10">Edytuj</button>
              <button onClick={() => handleDelete(selectedOrder.id)} className="bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-slate-700 hover:border-red-500">Usuń</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}