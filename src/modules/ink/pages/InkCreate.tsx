import { useNavigate } from "react-router-dom";
import { createInk } from "../api/inks";
import { useToast } from "@/shared/hooks/useToast";
import InkForm from "../components/InkForm";
import { Ink } from "../types";

export default function InkCreate() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Zmieniono 'any' na Omit<Ink, "id">, co oznacza wszystkie pola typu Ink poza ID
  const handleSubmit = async (values: Omit<Ink, "id">) => {
    try {
      await createInk(values);
      showToast("Pojemnik z farbą dodany pomyślnie", "success");
      navigate("/inks");
    } catch (err) {
      console.error("Błąd zapisu farby:", err);
      showToast("Błąd podczas dodawania farby", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Nowy pojemnik z farbą</h1>
      </div>
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
        <InkForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}