import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDieCut, updateDieCut } from "../api/dieCuts";
import type { DieCut } from "../api/dieCuts";
import ConfirmModal from "../components/ui/ConfirmModal";
import { useToast } from "../components/ui/useToast";

export default function DieCutEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState<DieCut | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getDieCut(Number(id));
      setForm(data);
      setLoading(false);
    };

    load();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (!prev) return prev;

      // 🔥 Jeśli zmieniamy status i NIE jest ACTIVE → czyścimy machine
      if (name === "status" && value !== "ACTIVE") {
        return {
          ...prev,
          status: value,
          machine: "",
        };
      }

      return {
        ...prev,
        [name]:
          name === "repeatTeeth" || name === "projectId"
            ? Number(value)
            : value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const confirmSave = async () => {
    if (!form) return;

    try {
      await updateDieCut(Number(id), form);
      showToast("Zmiany zostały zapisane.", "success");
      navigate(`/die-cuts/${id}`);
    } catch (err) {
      console.error("Błąd zapisu:", err);
      showToast("Nie udało się zapisać zmian.", "error");
    } finally {
      setConfirmOpen(false);
    }
  };

  if (loading || !form) return <div>Ładowanie...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edytuj wykrojnik</h1>

      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="space-y-6 bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">

          {/* NUMER */}
          <div>
            <label className="block mb-1 font-medium text-slate-200">
              Numer wykrojnika
            </label>
            <input
              type="text"
              name="dieNumber"
              value={form.dieNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-slate-900 border border-slate-700 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* POWTÓRZENIA */}
          <div>
            <label className="block mb-1 font-medium text-slate-200">
              Powtórzenia zębów
            </label>
            <input
              type="number"
              name="repeatTeeth"
              value={form.repeatTeeth}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-slate-900 border border-slate-700 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* PROJEKT */}
          <div>
            <label className="block mb-1 font-medium text-slate-200">
              ID projektu
            </label>
            <input
              type="number"
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-slate-900 border border-slate-700 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="block mb-1 font-medium text-slate-200">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-slate-900 border border-slate-700 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="AWAY">AWAY</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>

          {/* MASZYNA — tylko gdy ACTIVE */}
          {form.status === "ACTIVE" && (
            <div>
              <label className="block mb-1 font-medium text-slate-200">
                Maszyna
              </label>
              <select
                name="machine"
                value={form.machine ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-slate-900 border border-slate-700 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="">Wybierz maszynę</option>
                <option value="P5">P5</option>
                <option value="E5">E5</option>
                <option value="P7">P7</option>
                <option value="P7-11">P7-11</option>
              </select>
            </div>
          )}

          {/* NOTATKI */}
          <div>
            <label className="block mb-1 font-medium text-slate-200">
              Notatki
            </label>
            <textarea
              name="notes"
              value={form.notes ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-slate-900 border border-slate-700 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium 
                       shadow-md transition"
          >
            Zapisz zmiany
          </button>
        </div>
      </form>

      <ConfirmModal
        open={confirmOpen}
        title="Potwierdzenie"
        message="Czy na pewno chcesz zapisać zmiany?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmSave}
      />
    </div>
  );
}
