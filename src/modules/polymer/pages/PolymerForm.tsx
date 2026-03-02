import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { polymerService } from "../api/polymers";
import { CreatePolymerRequest } from "../types";
import { useToast } from "@/shared/hooks/useToast";

const INITIAL_STATE: CreatePolymerRequest = {
  projectId: 0,
  repeatTeeth: 0,
  lengthMm: 0,
  widthMm: 0,
  status: "ACTIVE", // Magazyn
  storageLocation: "",
  machine: "",
  notes: ""
};

const MACHINES = ["E5", "P5", "P7", "P7-11"];

export default function PolymerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState<CreatePolymerRequest>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const loadPolymer = async () => {
        try {
          const data = await polymerService.getById(Number(id));
          setFormData({
            projectId: data.projectId,
            repeatTeeth: data.repeatTeeth,
            lengthMm: data.lengthMm,
            widthMm: data.widthMm,
            status: data.status,
            storageLocation: data.storageLocation || "",
            machine: data.machine || "",
            notes: data.notes || ""
          });
        } catch  {
          showToast("Nie udało się pobrać danych polimeru", "error");
        }
      };
      loadPolymer();
    }
  }, [id, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (id) {
        await polymerService.update(Number(id), formData);
        showToast("Polimer zaktualizowany", "success");
      } else {
        await polymerService.create(formData);
        showToast("Polimer dodany do bazy", "success");
      }
      navigate("/polymers");
    } catch (error) {
      const msg = error.response?.data?.message || "Błąd zapisu";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-slate-700 bg-slate-900/50">
        <h2 className="text-xl font-semibold text-slate-100">
          {id ? "Edycja polimeru" : "Nowa forma fotopolimerowa"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Projekt ID */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">ID Projektu</label>
            <input
              type="number"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.projectId || ""}
              onChange={e => setFormData({ ...formData, projectId: Number(e.target.value) })}
            />
          </div>

          {/* Liczba zębów */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Powtórzenie (zęby)</label>
            <input
              type="number"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.repeatTeeth || ""}
              onChange={e => setFormData({ ...formData, repeatTeeth: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Wymiary */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Długość (mm)</label>
            <input
              type="number"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.lengthMm || ""}
              onChange={e => setFormData({ ...formData, lengthMm: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Szerokość (mm)</label>
            <input
              type="number"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.widthMm || ""}
              onChange={e => setFormData({ ...formData, widthMm: Number(e.target.value) })}
            />
          </div>
        </div>

        <hr className="border-slate-700" />

        {/* STATUS */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Status i Lokalizacja</label>
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: "ACTIVE" })}
              className={`flex-1 py-2 rounded-lg border font-medium transition ${
                formData.status === "ACTIVE"
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
                  : "bg-slate-900 border-slate-700 text-slate-500"
              }`}
            >
              W Magazynie
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: "INACTIVE" })}
              className={`flex-1 py-2 rounded-lg border font-medium transition ${
                formData.status === "INACTIVE"
                  ? "bg-amber-500/20 border-amber-500 text-amber-500"
                  : "bg-slate-900 border-slate-700 text-slate-500"
              }`}
            >
              Na Produkcji
            </button>
          </div>
        </div>

        {/* Dynamiczne pole: Maszyna lub Lokalizacja */}
        {formData.status === "INACTIVE" ? (
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Maszyna</label>
            <select
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.machine}
              onChange={e => setFormData({ ...formData, machine: e.target.value })}
            >
              <option value="">-- Wybierz maszynę --</option>
              {MACHINES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Miejsce w magazynie</label>
            <input
              type="text"
              placeholder="np. Regał A-12"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.storageLocation}
              onChange={e => setFormData({ ...formData, storageLocation: e.target.value })}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Uwagi</label>
          <textarea
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none h-24"
            value={formData.notes || ""}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/polymers")}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-lg font-bold disabled:opacity-50"
          >
            {isSubmitting ? "Zapisywanie..." : id ? "Zaktualizuj polimer" : "Zapisz polimer"}
          </button>
        </div>
      </form>
    </div>
  );
}