import { useState } from "react";
import { createDieCut } from "../api/dieCuts";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/useToast";

export default function DieCutCreate() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    dieNumber: "",
    repeatTeeth: 0,
    projectId: 0,
    status: "ACTIVE",
    notes: "",
    machine: "", // 🔥 NOWE POLE
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmed = window.confirm("Czy na pewno chcesz dodać wykrojnik?");
    if (!confirmed) return;

    setLoading(true);

    try {
      await createDieCut(form);
      showToast("Wykrojnik został dodany.", "success");
      navigate("/");
    } catch (err) {
      console.error("Błąd podczas tworzenia wykrojnika:", err);
      showToast("Nie udało się utworzyć wykrojnika.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dodaj wykrojnik</h1>

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
              required
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
              required
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
              required
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
                value={form.machine}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-slate-900 border border-slate-700 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none"
                required={form.status === "ACTIVE"}
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
              value={form.notes}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-slate-900 border border-slate-700 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium 
                       shadow-md transition disabled:opacity-50"
          >
            {loading ? "Zapisywanie..." : "Zapisz"}
          </button>
        </div>
      </form>
    </div>
  );
}
