import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMaterial, deleteMaterial } from "../api/materials";
import type { RawMaterial } from "../types";
import { useToast } from "@/shared/hooks/useToast";

export default function RawMaterialDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [material, setMaterial] = useState<RawMaterial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMaterial = async () => {
      try {
        if (id) {
          const data = await getMaterial(Number(id));
          setMaterial(data);
        }
      } catch {
        showToast("Nie udało się pobrać danych surowca", "error");
        navigate("/raw-materials");
      } finally {
        setLoading(false);
      }
    };
    loadMaterial();
  }, [id, navigate, showToast]);

  const handleDelete = async () => {
    if (window.confirm("Czy na pewno chcesz usunąć ten surowiec?")) {
      try {
        await deleteMaterial(Number(id));
        showToast("Surowiec został usunięty", "success");
        navigate("/raw-materials");
      } catch {
        showToast("Błąd podczas usuwania", "error");
      }
    }
  };

  if (loading) return <div className="p-6 text-slate-400 italic">Pobieranie danych z bazy...</div>;
  if (!material) return null;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Surowiec / Batch</span>
          <h1 className="text-3xl font-bold text-slate-100">{material.batchNumber}</h1>
        </div>
        <div className="flex gap-3">
          <Link to={`/raw-materials/${id}/edit`} className="px-4 py-2 bg-amber-600/20 text-amber-500 border border-amber-600/30 rounded-lg hover:bg-amber-600/40 transition font-medium">
            Edytuj
          </Link>
          <Link to="/raw-materials" className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition">
            Lista
          </Link>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600/20 text-red-500 border border-red-600/30 rounded-lg hover:bg-red-600/40 transition">
            Usuń
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEWA KOLUMNA: TECHNICZNE */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-sm font-semibold text-blue-400 uppercase mb-4 border-b border-slate-700 pb-2">Parametry materiału</h3>
          <div className="space-y-4">
            <DetailRow label="Dostawca" value={material.supplier} />
            <DetailRow label="Szerokość" value={`${material.widthMm} mm`} />
            <DetailRow label="Długość całkowita" value={`${material.lengthM} mb`} />
            <DetailRow label="Data przyjęcia" value={new Date(material.receivedDate).toLocaleDateString()} />
          </div>
        </div>

        {/* PRAWA KOLUMNA: STATUS I LOGISTYKA */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-sm font-semibold text-blue-400 uppercase mb-4 border-b border-slate-700 pb-2">Status i Lokalizacja</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Status:</span>
              <span className={`px-3 py-1 rounded text-xs font-bold border ${getStatusClass(material.status)}`}>
                {material.status}
              </span>
            </div>

            {/* Warunkowe wyświetlanie Maszyny lub Magazynu */}
            {material.status === 'READY' || material.status === 'IN_USE' ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <span className="text-xs text-amber-500 font-bold uppercase block mb-1">Aktualna lokalizacja:</span>
                <span className="text-xl text-slate-100 font-bold tracking-tight text-center block">
                   MASZYNA {material.assignedMachine}
                </span>
              </div>
            ) : (
              <DetailRow 
                label="Lokalizacja w magazynie" 
                value={material.warehouseLocation || "Nieokreślona"} 
                highlight 
              />
            )}
            
            {material.status === 'COMPLAINT' && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-sm font-medium">
                Uwaga: Surowiec zablokowany do czasu rozpatrzenia reklamacji.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponenty pomocnicze
function DetailRow({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
      <span className="text-slate-400 text-sm">{label}:</span>
      <span className={`font-medium ${highlight ? 'text-blue-400' : 'text-slate-100'}`}>{value}</span>
    </div>
  );
}

function getStatusClass(status: string) {
  switch (status) {
    case "AVAILABLE": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "READY": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "IN_USE": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "COMPLAINT": return "bg-red-500/10 text-red-500 border-red-500/20";
    default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
  }
}