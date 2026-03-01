"use no memo";

import { useForm } from "react-hook-form";
import { Ink } from "../types";

// Definiujemy typ danych, którymi operuje formularz (wszystko oprócz ID)
type InkFormValues = Omit<Ink, "id">;

interface InkFormProps {
  initialData?: Partial<Ink>;
  onSubmit: (data: InkFormValues) => void;
}

export default function InkForm({ initialData, onSubmit }: InkFormProps) {
  // Zamiast 'any', rzutujemy na InkFormValues, co jest zgodne z przeznaczeniem formularza
  const { register, handleSubmit, watch } = useForm<InkFormValues>({
    defaultValues: {
      inkColorId: initialData?.inkColorId ?? 0,
      quantityKg: initialData?.quantityKg ?? 0,
      batchNumber: initialData?.batchNumber ?? "",
      storageLocation: initialData?.storageLocation ?? "",
      receivedDate: initialData?.receivedDate ?? new Date().toISOString().split('T')[0],
      status: initialData?.status ?? "INACTIVE",
      machine: initialData?.machine ?? "",
      notes: initialData?.notes ?? ""
    }
  });

  const selectedStatus = watch("status");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ID Koloru */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">ID Koloru</label>
          <input
            type="number"
            {...register("inkColorId", { required: true, valueAsNumber: true })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
          />
        </div>

        {/* Numer Partii */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Numer Partii</label>
          <input
            {...register("batchNumber", { required: true })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Status pojemnika</label>
          <select
            {...register("status")}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
          >
            <option value="INACTIVE">MAGAZYN (Nieaktywna)</option>
            <option value="ACTIVE">PRODUKCJA (Wydana na maszynę)</option>
          </select>
        </div>

        {/* Maszyna */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Maszyna (dla Produkcji)</label>
          <select
            {...register("machine")}
            disabled={selectedStatus !== "ACTIVE"}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white disabled:opacity-30"
          >
            <option value="">Wybierz maszynę...</option>
            <option value="E5">E5</option>
            <option value="P5">P5</option>
            <option value="P7">P7</option>
            <option value="P7-11">P7-11</option>
          </select>
        </div>

        {/* Lokalizacja */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Miejsce w magazynie</label>
          <input
            {...register("storageLocation")}
            disabled={selectedStatus !== "INACTIVE"}
            placeholder={selectedStatus === "ACTIVE" ? "Farba na maszynie" : "np. Regał A-1"}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white disabled:opacity-30"
          />
        </div>

        {/* Ilość kg */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Ilość (kg)</label>
          <input
            type="number"
            step="0.01"
            {...register("quantityKg", { required: true, valueAsNumber: true })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
          />
        </div>

        {/* Data przyjęcia */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Data przyjęcia</label>
          <input
            type="date"
            {...register("receivedDate")}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
          />
        </div>

        {/* Notatki */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Dodatkowe notatki</label>
          <textarea
            {...register("notes")}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white h-20"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition mt-4 shadow-xl uppercase"
      >
        Zatwierdź i zapisz
      </button>
    </form>
  );
}