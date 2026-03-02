import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { polymerService } from "../api/polymers";
import type { PolymerPage, PolymerQueryParams } from "../types/index";
import { useToast } from "@/shared/hooks/useToast";

export default function PolymerList() {
  const { showToast } = useToast();
  const [data, setData] = useState<PolymerPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<PolymerQueryParams>({ page: 0, size: 20 });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await polymerService.getAll(params);
      setData(result);
    } catch {
      showToast("Błąd podczas pobierania listy polimerów", "error");
    } finally {
      setLoading(false);
    }
  }, [params, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Czy na pewno usunąć ten polimer?")) {
      try {
        await polymerService.delete(id);
        showToast("Polimer usunięty", "success");
        loadData();
      } catch {
        showToast("Nie udało się usunąć polimeru", "error");
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }));
  };

  if (loading && !data) {
    return <div className="p-6 text-slate-400 italic">Ładowanie magazynu polimerów...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Magazyn Polimerów</h1>
          <p className="text-slate-500 text-sm">Zarządzanie formami fotopolimerowymi i lokalizacją</p>
        </div>
        <Link
          to="/polymers/create"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-lg font-medium"
        >
          Dodaj polimer
        </Link>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700">
              <th className="p-4 font-medium text-slate-300">Projekt</th>
              <th className="p-4 font-medium text-slate-300">Zęby</th>
              <th className="p-4 font-medium text-slate-300">Wymiary (mm)</th>
              <th className="p-4 font-medium text-slate-300">Lokalizacja / Maszyna</th>
              <th className="p-4 font-medium text-slate-300">Status</th>
              <th className="p-4 font-medium text-slate-300 text-center">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {data?.content.map((polymer) => (
              <tr key={polymer.id} className="hover:bg-slate-700/30 transition">
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-900 rounded text-indigo-400 font-bold border border-indigo-500/20">
                    ID: {polymer.projectId}
                  </span>
                </td>
                <td className="p-4 text-slate-200 font-mono text-sm">{polymer.repeatTeeth}z</td>
                <td className="p-4 text-slate-100 font-semibold">
                  {polymer.lengthMm} x {polymer.widthMm}
                </td>
                <td className="p-4 text-slate-400">
                  {polymer.status === 'INACTIVE' ? (
                    <span className="text-amber-500 font-medium">Maszyna: {polymer.machine || '—'}</span>
                  ) : (
                    polymer.storageLocation || "—"
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
                    polymer.status === 'ACTIVE' 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {polymer.status === 'ACTIVE' ? 'Magazyn' : 'Produkcja'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <Link 
                      to={`/polymers/${polymer.id}/edit`} 
                      className="text-amber-500 hover:text-amber-400 text-sm font-medium transition"
                    >
                      Edytuj
                    </Link>
                    <button 
                      onClick={() => handleDelete(polymer.id)} 
                      className="text-red-500 hover:text-red-400 text-sm font-medium transition"
                    >
                      Usuń
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data?.content.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                  Brak polimerów w bazie danych.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Nawigacja stronami (Spring Data Page) */}
        {data && data.totalPages > 1 && (
          <div className="p-4 bg-slate-900/30 border-t border-slate-700 flex justify-between items-center">
            <button 
              disabled={params.page === 0}
              onClick={() => handlePageChange((params.page || 0) - 1)}
              className="px-3 py-1 text-sm bg-slate-700 text-slate-300 rounded hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700 transition"
            >
              Poprzednia
            </button>
            <span className="text-slate-500 text-xs font-medium">
              Strona {(params.page || 0) + 1} z {data.totalPages}
            </span>
            <button 
              disabled={(params.page || 0) >= data.totalPages - 1}
              onClick={() => handlePageChange((params.page || 0) + 1)}
              className="px-3 py-1 text-sm bg-slate-700 text-slate-300 rounded hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700 transition"
            >
              Następna
            </button>
          </div>
        )}
      </div>
    </div>
  );
}