import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMaterial, updateMaterial } from "../api/materials";
import type { RawMaterialCreatePayload, RawMaterialStatus } from "../types";
import { useToast } from "@/shared/hooks/useToast";

export default function RawMaterialEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const machines = ["E5", "P5", "P7", "P7-11"];

  const [form, setForm] = useState<RawMaterialCreatePayload>({
    widthMm: 0,
    lengthM: 0,
    batchNumber: "",
    supplier: "",
    receivedDate: "",
    status: "AVAILABLE",
    warehouseLocation: "",
    assignedMachine: "", // Dodane pole dla maszyny
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (id) {
          const data = await getMaterial(Number(id));
          setForm({
            widthMm: data.widthMm,
            lengthM: data.lengthM,
            batchNumber: data.batchNumber,
            supplier: data.supplier,
            receivedDate: data.receivedDate.split('T')[0],
            status: data.status as RawMaterialStatus,
            warehouseLocation: data.warehouseLocation || "",
            assignedMachine: data.assignedMachine || "",
          });
        }
      } catch {
        showToast("Nie udało się załadować danych do edycji", "error");
        navigate("/raw-materials");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: (name === "widthMm" || name === "lengthM") ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja logiczna przed wysyłką
    if ((form.status === "READY" || form.status === "IN_USE") && !form.assignedMachine) {
      showToast("Proszę wybrać maszynę dla tego statusu", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        widthMm: Number(form.widthMm),
        lengthM: Number(form.lengthM),
        // Czyścimy niepotrzebne pola w zależności od statusu przed wysyłką
        warehouseLocation: form.status === "AVAILABLE" ? form.warehouseLocation : "",
        assignedMachine: (form.status === "READY" || form.status === "IN_USE") ? form.assignedMachine : ""
      };
      
      await updateMaterial(Number(id), payload);
      showToast("Zmiany zostały zapisane", "success");
      navigate(`/raw-materials/${id}`);
    } catch {
      showToast("Błąd podczas aktualizacji", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-slate-400">Wczytywanie...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6 text-slate-100">Edycja surowca</h1>
      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg border border-slate-700 space-y-5">
        
        {/* PODSTAWOWE DANE (Dostawca i Batch) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Dostawca</label>
            <input name="supplier" value={form.supplier} onChange={handleChange} required
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Nr partii (Batch)</label>
            <input name="batchNumber" value={form.batchNumber} onChange={handleChange} required
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 outline-none focus:border-blue-500" />
          </div>
        </div>

        {/* STATUS */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
          <select 
            name="status" 
            value={form.status} 
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 outline-none focus:border-blue-500"
          >
            <option value="AVAILABLE">Dostępny (AVAILABLE)</option>
            <option value="READY">Przygotowany (READY)</option>
            <option value="IN_USE">W użyciu (IN_USE)</option>
            <option value="COMPLAINT">Reklamacja (COMPLAINT)</option>
          </select>
        </div>

        {/* WARUNKOWE: LOKALIZACJA (Dla AVAILABLE) */}
        {form.status === "AVAILABLE" && (
          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg shadow-inner">
            <label className="block text-sm font-medium text-blue-400 mb-1">Miejsce w magazynie</label>
            <input 
              name="warehouseLocation" 
              value={form.warehouseLocation} 
              onChange={handleChange}
              required
              placeholder="np. Sektor A-1"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 outline-none focus:border-blue-500" 
            />
          </div>
        )}

        {/* WARUNKOWE: WYBÓR MASZYNY (Dla READY i IN_USE) */}
        {(form.status === "READY" || form.status === "IN_USE") && (
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg shadow-inner">
            <label className="block text-sm font-medium text-amber-400 mb-3">Przypisz do maszyny</label>
            <div className="grid grid-cols-4 gap-2">
              {machines.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, assignedMachine: m }))}
                  className={`py-2 rounded border transition font-medium ${
                    form.assignedMachine === m 
                    ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-900/20' 
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* WARUNKOWE: INFO DLA REKLAMACJI */}
        {form.status === "COMPLAINT" && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm italic">
            Uwaga: Surowce ze statusem reklamacji nie są brane pod uwagę w planowaniu produkcji.
          </div>
        )}

        {/* WYMIARY */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Szerokość (mm)</label>
            <input type="number" name="widthMm" value={form.widthMm} onChange={handleChange} required
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Długość (m)</label>
            <input type="number" name="lengthM" value={form.lengthM} onChange={handleChange} required
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-slate-700/50">
          <button type="button" onClick={() => navigate(-1)} 
            className="flex-1 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition">
            Anuluj
          </button>
          <button type="submit" disabled={saving} 
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 font-medium shadow-lg shadow-blue-900/20">
            {saving ? "Zapisywanie..." : "Zapisz zmiany"}
          </button>
        </div>
      </form>
    </div>
  );
}