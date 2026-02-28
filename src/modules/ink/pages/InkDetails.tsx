import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getInk } from "../api/inks";
import type { Ink } from "../types";

export default function InkDetails() {
  const { id } = useParams();
  const [ink, setInk] = useState<Ink | null>(null);

  useEffect(() => {
    if (id) getInk(Number(id)).then(setInk);
  }, [id]);

  if (!ink) return <div className="p-6 text-slate-400">Pobieranie danych...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Szczegóły pojemnika: {ink.batchNumber}</h2>
          <Link to="/inks" className="text-sm text-slate-400 hover:text-white transition">Wróć do listy</Link>
        </div>
        <div className="p-6 grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <InfoItem label="ID Koloru" value={ink.inkColorId.toString()} />
            <InfoItem label="Ilość" value={`${ink.quantityKg} kg`} />
            <InfoItem label="Data przyjęcia" value={new Date(ink.receivedDate).toLocaleDateString()} />
          </div>
          <div className="space-y-4">
            <InfoItem label="Status" value={ink.status} />
            <InfoItem label="Lokalizacja" value={ink.storageLocation || "Nieokreślona"} />
          </div>
          <div className="col-span-2 pt-4 border-t border-slate-700/50">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Notatki / Uwagi:</h4>
            <p className="text-slate-300 bg-slate-900/50 p-4 rounded-lg italic text-sm">
              {ink.notes || "Brak dodatkowych uwag dla tego pojemnika."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <span className="text-xs text-slate-500 uppercase font-bold block">{label}</span>
      <span className="text-lg text-slate-200 font-medium">{value}</span>
    </div>
  );
}