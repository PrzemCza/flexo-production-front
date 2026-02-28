import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchInks, deleteInk } from "../api/inks";
import type { InkPage, InkQueryParams } from "../types";
import { useToast } from "@/shared/hooks/useToast";

export default function InkList() {
  const { showToast } = useToast();
  const [data, setData] = useState<InkPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<InkQueryParams>({ page: 0, size: 20 });

  // Używamy useCallback, aby funkcja loadData nie zmieniała się przy każdym renderze
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchInks(params);
      setData(result);
    } catch {
      showToast("Błąd podczas pobierania listy farb", "error");
    } finally {
      setLoading(false);
    }
  }, [params, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Czy na pewno usunąć ten pojemnik z farbą?")) {
      try {
        await deleteInk(id);
        showToast("Farba usunięta", "success");
        loadData();
      } catch {
        showToast("Nie udało się usunąć farby", "error");
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }));
  };

  if (loading && !data) return <div className="p-6 text-slate-400 italic">Ładowanie magazynu farb...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Magazyn Farb</h1>
          <p className="text-slate-500 text-sm">Zarządzanie pojemnikami i stanami kg</p>
        </div>
        <Link
          to="/inks/create"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-lg font-medium"
        >
          Dodaj pojemnik
        </Link>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700">
              <th className="p-4 font-medium text-slate-300">ID Koloru</th>
              <th className="p-4 font-medium text-slate-300">Nr Partii</th>
              <th className="p-4 font-medium text-slate-300 text-right">Ilość (kg)</th>
              <th className="p-4 font-medium text-slate-300">Lokalizacja</th>
              <th className="p-4 font-medium text-slate-300">Status</th>
              <th className="p-4 font-medium text-slate-300 text-center">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {data?.content.map((ink) => (
              <tr key={ink.id} className="hover:bg-slate-700/30 transition">
                <td className="p-4">
                   <span className="px-2 py-1 bg-slate-900 rounded text-indigo-400 font-bold border border-indigo-500/20">
                     ID: {ink.inkColorId}
                   </span>
                </td>
                <td className="p-4 text-slate-200 font-mono text-sm">{ink.batchNumber}</td>
                <td className="p-4 text-slate-100 text-right font-semibold">{ink.quantityKg.toFixed(2)} kg</td>
                <td className="p-4 text-slate-400">{ink.storageLocation || "—"}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
                    ink.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>
                    {ink.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <Link to={`/inks/${ink.id}/edit`} className="text-amber-500 hover:text-amber-400 text-sm font-medium">Edytuj</Link>
                    <button onClick={() => handleDelete(ink.id)} className="text-red-500 hover:text-red-400 text-sm font-medium">Usuń</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Prosta nawigacja stronami wykorzystująca setParams */}
        {data && data.totalPages > 1 && (
          <div className="p-4 bg-slate-900/30 border-t border-slate-700 flex justify-between items-center">
            <button 
              disabled={params.page === 0}
              onClick={() => handlePageChange((params.page || 0) - 1)}
              className="px-3 py-1 text-sm bg-slate-700 text-slate-300 rounded disabled:opacity-30"
            >
              Poprzednia
            </button>
            <span className="text-slate-500 text-xs">Strona {(params.page || 0) + 1} z {data.totalPages}</span>
            <button 
              disabled={(params.page || 0) >= data.totalPages - 1}
              onClick={() => handlePageChange((params.page || 0) + 1)}
              className="px-3 py-1 text-sm bg-slate-700 text-slate-300 rounded disabled:opacity-30"
            >
              Następna
            </button>
          </div>
        )}
      </div>
    </div>
  );
}