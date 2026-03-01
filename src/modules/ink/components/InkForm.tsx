
import { useForm } from "react-hook-form";
import { Ink } from "../types";

interface InkFormProps {
  initialData?: Partial<Ink>;
  onSubmit: (data: Omit<Ink, "id">) => void;
}

export default function InkForm({ initialData, onSubmit }: InkFormProps) {
  const { register, handleSubmit, watch } = useForm<Omit<Ink, "id">>({
    defaultValues: initialData || {
      //inkColorId: 0,
      quantityKg: 0,
      batchNumber: "",
      storageLocation: "",
      receivedDate: new Date().toISOString().split('T')[0],
      status: "INACTIVE",
      machine: "",
      notes: ""
    }
  });

  const selectedStatus = watch("status");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">ID Koloru</label>
          <input
            type="number"
            {...register("inkColorId", { required: true, valueAsNumber: true })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Numer Partii</label>
          <input
            {...register("batchNumber", { required: true })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
          <select
            {...register("status")}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
          >
            <option value="INACTIVE">Magazyn</option>
            <option value="ACTIVE">Produkcja (Na maszynie)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Maszyna</label>
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

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Ilość (kg)</label>
          <input
            type="number"
            step="0.01"
            {...register("quantityKg", { required: true, valueAsNumber: true })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Data przyjęcia</label>
          <input
            type="date"
            {...register("receivedDate")}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Notatki</label>
          <textarea
            {...register("notes")}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white h-20"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition mt-4"
      >
        Zapisz dane
      </button>
    </form>
  );
}