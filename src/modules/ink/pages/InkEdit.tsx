import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInk, updateInk } from "../api/inks";
import { useToast } from "@/shared/hooks/useToast";
import InkForm from "../components/InkForm";
import { Ink } from "../types";

export default function InkEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [ink, setInk] = useState<Ink | null>(null);
  const [loading, setLoading] = useState(true);

  const loadInkData = useCallback(async (inkId: number) => {
    try {
      const data = await getInk(inkId);
      setInk(data);
    } catch {
      showToast("Nie udało się pobrać danych farby", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (id) {
      loadInkData(Number(id));
    }
  }, [id, loadInkData]);

  const handleSubmit = async (values: Omit<Ink, "id">) => {
    if (!id) return;
    try {
      await updateInk(Number(id), values);
      showToast("Dane farby zostały zaktualizowane", "success");
      navigate("/inks");
    } catch (err) {
      console.error("Błąd aktualizacji:", err);
      showToast("Błąd podczas aktualizacji farby", "error");
    }
  };

  if (loading) return <div className="p-6 text-slate-400 italic">Wczytywanie danych...</div>;
  if (!ink) return <div className="p-6 text-red-400">Nie znaleziono farby.</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Edycja pojemnika</h1>
        <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">ID: {id}</span>
      </div>
      
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
        <InkForm 
          initialData={ink as Partial<Ink>} 
          onSubmit={handleSubmit} 
        />
      </div>
    </div>
  );
}