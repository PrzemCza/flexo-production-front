import { useForm } from "react-hook-form";
import { Ink } from "../types";

interface Props {
  initialData?: Partial<Ink>;
  onSubmit: (data: Omit<Ink, "id">) => void;
}

export default function InkForm({ initialData, onSubmit }: Props) {
  // Usunięto 'errors', ponieważ nie był używany w kodzie, co zgłaszał ESLint
  const { register, handleSubmit } = useForm<Omit<Ink, "id">>({
    defaultValues: initialData || {
      status: 'INACTIVE',
      receivedDate: new Date().toISOString().split('T')[0],
      inkColorId: 0,
      quantityKg: 0,
      batchNumber: '',
      storageLocation: '',
      notes: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ID Koloru */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">ID Koloru (Pantone ID)</label>
          <input
            type="number"
            {...register("inkColorId", { required: true, valueAsNumber: true })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Ilość kg */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Ilość (kg)</label>
          <input
            type="number"
            step="0.01"
            {...register("quantityKg", { required: true, min: 0, valueAsNumber: true })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Nr Partii */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Numer Partii (Batch)</label>
          <input
            {...register("batchNumber", { required: true })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Lokalizacja */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Lokalizacja Magazynowa</label>
          <input
            {...register("storageLocation")}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Data przyjęcia */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Data przyjęcia</label>
          <input
            type="date"
            {...register("receivedDate", { required: true })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
          <select
            {...register("status")}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="INACTIVE">W MAGAZYNIE (INACTIVE)</option>
            <option value="ACTIVE">PRZYGOTOWANA (ACTIVE)</option>
          </select>
        </div>
      </div>

      {/* Notatki */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">Notatki / Uwagi</label>
        <textarea
          {...register("notes")}
          rows={3}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-bold"
        >
          Zapisz pojemnik
        </button>
      </div>
    </form>
  );
}