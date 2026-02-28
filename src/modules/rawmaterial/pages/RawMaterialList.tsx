import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMaterials } from "../api/materials";
import type { RawMaterial, RawMaterialPage, RawMaterialQueryParams } from "../types";
import { useToast } from "@/shared/hooks/useToast";

export default function RawMaterialList() {
  const { showToast } = useToast();
  const [data, setData] = useState<RawMaterialPage | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Stan dla parametrów wyszukiwania i paginacji
  const [params, setParams] = useState<RawMaterialQueryParams>({
    page: 0,
    size: 20,
    sort: "id,desc",
  });

  useEffect(() => {
    const loadMaterials = async () => {
      setLoading(true);
      try {
        const result = await fetchMaterials(params);
        setData(result);
      } catch (err) {
        console.error("Błąd podczas pobierania surowców:", err);
        showToast("Nie udało się załadować listy surowców.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, [params, showToast]);

  if (loading && !data) return <div className="p-6 text-slate-400">Ładowanie...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-100">Magazyn Surowców</h1>
        <Link
          to="/raw-materials/create"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md"
        >
          Dodaj surowiec
        </Link>
      </div>

      {/* TABELA */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700">
              <th className="p-4 font-medium text-slate-300">Dostawca</th>
              <th className="p-4 font-medium text-slate-300">Nr partii (Batch)</th>
              <th className="p-4 font-medium text-slate-300 text-right">Szerokość</th>
              <th className="p-4 font-medium text-slate-300 text-right">Długość</th>
              <th className="p-4 font-medium text-slate-300">Status</th>
              <th className="p-4 font-medium text-slate-300">Lokalizacja / Maszyna</th>
              <th className="p-4 font-medium text-slate-300 text-center">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {data?.content?.map((item: RawMaterial) => (
              <tr key={item.id} className="hover:bg-slate-700/30 transition border-b border-slate-700/30 last:border-0">
                <td className="p-4 text-slate-200">{item.supplier}</td>
                <td className="p-4 text-blue-400 font-mono text-sm font-medium">{item.batchNumber}</td>
                <td className="p-4 text-slate-200 text-right">{item.widthMm} mm</td>
                <td className="p-4 text-slate-200 text-right">{item.lengthM} mb</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                
                {/* DYNAMICZNA KOLUMNA LOKALIZACJI */}
                <td className="p-4">
                  {item.status === 'READY' || item.status === 'IN_USE' ? (
                    <div className="flex items-center gap-2 text-amber-400">
                      <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </div>
                      <span className="text-sm font-semibold tracking-wide">
                        MASZYNA: {item.assignedMachine || "???"}
                      </span>
                    </div>
                  ) : item.status === 'COMPLAINT' ? (
                    <span className="text-red-400 text-sm italic font-medium">Blokada reklamacyjna</span>
                  ) : (
                    <span className="text-slate-400 text-sm font-medium">
                      {item.warehouseLocation || "Brak lokalizacji"}
                    </span>
                  )}
                </td>

                <td className="p-4 text-center">
                  <div className="flex justify-center gap-4">
                    <Link
                      to={`/raw-materials/${item.id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition underline-offset-4 hover:underline"
                    >
                      Szczegóły
                    </Link>
                    <Link
                      to={`/raw-materials/${item.id}/edit`}
                      className="text-amber-400 hover:text-amber-300 text-sm font-semibold transition underline-offset-4 hover:underline"
                    >
                      Edytuj
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {data?.content?.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-500 italic">
                  Nie znaleziono surowców spełniających kryteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACJA */}
      <div className="flex justify-between items-center text-sm text-slate-400 px-2">
        <div className="flex items-center gap-4">
           <span>Łącznie: <span className="text-slate-200 font-medium">{data?.totalElements || 0}</span></span>
        </div>
        <div className="flex gap-2">
          <button
            disabled={params.page === 0}
            onClick={() => setParams(p => ({ ...p, page: (p.page || 0) - 1 }))}
            className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Poprzednia
          </button>
          <div className="flex items-center px-4 bg-slate-900/50 rounded-lg border border-slate-700">
            Strona {(data?.number || 0) + 1} z {data?.totalPages || 1}
          </div>
          <button
            disabled={(data?.number || 0) + 1 >= (data?.totalPages || 1)}
            onClick={() => setParams(p => ({ ...p, page: (p.page || 0) + 1 }))}
            className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Następna
          </button>
        </div>
      </div>
    </div>
  );
}

function getStatusClass(status: string) {
  switch (status) {
    case "AVAILABLE": 
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "READY": 
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "IN_USE": 
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "COMPLAINT": 
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default: 
      return "bg-slate-500/10 text-slate-500 border-slate-500/20";
  }
}