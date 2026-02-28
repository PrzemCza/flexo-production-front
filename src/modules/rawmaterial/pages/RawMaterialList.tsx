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
              <th className="p-4 font-medium text-slate-300">Lokalizacja</th>
              <th className="p-4 font-medium text-slate-300 text-center">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {data?.content?.map((item: RawMaterial) => (
              <tr key={item.id} className="hover:bg-slate-700/30 transition">
                <td className="p-4 text-slate-200">{item.supplier}</td>
                <td className="p-4 text-blue-400 font-mono text-sm">{item.batchNumber}</td>
                <td className="p-4 text-slate-200 text-right">{item.widthMm} mm</td>
                <td className="p-4 text-slate-200 text-right">{item.lengthM} mb</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-slate-400 text-sm">{item.warehouseLocation || "—"}</td>
                <td className="p-4 text-center">
                  <Link
                    to={`/raw-materials/${item.id}`}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    Szczegóły
                  </Link>
                </td>
              </tr>
            ))}
            {data?.content?.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                  Brak surowców w bazie danych.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PROSTA PAGINACJA */}
      <div className="flex justify-between items-center text-sm text-slate-400 px-2">
        <span>Łącznie: {data?.totalElements || 0}</span>
        <div className="flex gap-2">
          <button
            disabled={params.page === 0}
            onClick={() => setParams(p => ({ ...p, page: (p.page || 0) - 1 }))}
            className="px-3 py-1 bg-slate-800 rounded border border-slate-700 disabled:opacity-30"
          >
            Poprzednia
          </button>
          <span className="py-1">Strona {(data?.number || 0) + 1} z {data?.totalPages || 1}</span>
          <button
            disabled={(data?.number || 0) + 1 >= (data?.totalPages || 1)}
            onClick={() => setParams(p => ({ ...p, page: (p.page || 0) + 1 }))}
            className="px-3 py-1 bg-slate-800 rounded border border-slate-700 disabled:opacity-30"
          >
            Następna
          </button>
        </div>
      </div>
    </div>
  );
}

// Funkcja pomocnicza dla statusów (możesz ją przenieść do folderu utils)
function getStatusClass(status: string) {
  switch (status) {
    case "AVAILABLE": return "bg-green-500/10 text-green-500 border border-green-500/20";
    case "IN_USE": return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
    case "FINISHED": return "bg-slate-500/10 text-slate-500 border border-slate-500/20";
    default: return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
  }
}