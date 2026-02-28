import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMaterial } from "../api/materials";
import type { RawMaterialCreatePayload } from "../types";
import { useToast } from "@/shared/hooks/useToast";

export default function RawMaterialCreate() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<RawMaterialCreatePayload>({
    widthMm: 0,
    lengthM: 0,
    batchNumber: "",
    supplier: "",
    receivedDate: new Date().toISOString().split('T')[0], // Domyślnie dzisiaj
    status: "AVAILABLE",
    warehouseLocation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: (name === "widthMm" || name === "lengthM") ? Number(value) : value
    } as RawMaterialCreatePayload));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const payload = {
      ...form,
      // 1. Konwersja na liczby całkowite (backend ma Integer, nie Double/Float)
      widthMm: Math.round(Number(form.widthMm)),
      lengthM: Math.round(Number(form.lengthM)),
      
      // 2. WYSYŁAMY CZYSTY STRING "YYYY-MM-DD" 
      // Twoje form.receivedDate już jest w tym formacie z inputa type="date"
      // NIE używaj tutaj .toISOString()
      receivedDate: form.receivedDate, 

      // 3. Zabezpieczenie przed @NotBlank - jeśli puste, wyślij np. "Brak" lub upewnij się, że nie jest puste
      warehouseLocation: form.warehouseLocation || "Nieokreślona"
    };

    console.log("Wysyłany payload do serwera:", payload);

    await createMaterial(payload);
    showToast("Surowiec dodany do magazynu", "success");
    navigate("/raw-materials");
  } catch (err) {
    // Bardzo ważne: sprawdź co dokładnie mówi serwer o błędach walidacji
    console.error("Błąd 400 - szczegóły z serwera:", err.response?.data);
    showToast("Błąd walidacji danych. Sprawdź formularz.", "error");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6 text-slate-100">Przyjęcie surowca</h1>
      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg border border-slate-700 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Dostawca</label>
            <input name="supplier" value={form.supplier} onChange={handleChange} required
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Numer partii (Batch)</label>
            <input name="batchNumber" value={form.batchNumber} onChange={handleChange} required
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 outline-none focus:border-blue-500" />
          </div>
        </div>

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

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Data przyjęcia</label>
          <input type="date" name="receivedDate" value={form.receivedDate} onChange={handleChange} required
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 outline-none focus:border-blue-500" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition disabled:opacity-50">
          {loading ? "Zapisywanie..." : "Zatwierdź przyjęcie"}
        </button>
      </form>
    </div>
  );
}