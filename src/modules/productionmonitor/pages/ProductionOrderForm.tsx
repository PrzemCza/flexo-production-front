import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductionDependencies, productionService } from "../api/production";
import { useToast } from "@/shared/hooks/useToast";

export default function ProductionOrderForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<ProductionDependencies>({ 
    materials: [], 
    dieCuts: [], 
    polymers: { content: [] }, 
    inks: [] 
  });
  
  const [formData, setFormData] = useState({
    orderNumber: "",
    jobName: "",
    targetMachine: "P7",
    rawMaterialId: "",
    dieCutId: "",
    polymerId: "",
    inkIds: [] as number[],
    deadline: ""
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await productionService.getDependencies();
        setOptions(data);
      } catch {
        showToast("Błąd pobierania danych słownikowych", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Rzutujemy formData na Record<string, unknown> aby zgadzało się z sygnaturą create
      await productionService.create(formData as unknown as Record<string, unknown>);
      showToast("Zlecenie utworzone pomyślnie", "success");
      navigate("/production-monitor");
    } catch {
      showToast("Błąd podczas tworzenia zlecenia", "error");
    }
  };

  if (loading) return <div className="p-8 text-slate-400 italic font-medium">Przygotowywanie komponentów...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="border-b border-slate-700 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Nowe Zlecenie Produkcyjne</h1>
        <p className="text-slate-400 text-sm">Skonfiguruj parametry i przypisz zasoby do produkcji</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-sm">
        
        {/* Podstawowe Dane */}
        <div className="space-y-4">
          <label className="block">
            <span className="text-slate-300 text-xs uppercase font-bold tracking-wider">Numer Zlecenia</span>
            <input 
              type="text" required
              className="mt-1 block w-full bg-slate-900 border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.orderNumber}
              onChange={e => setFormData({...formData, orderNumber: e.target.value})}
              placeholder="np. ZP/2024/001"
            />
          </label>

          <label className="block">
            <span className="text-slate-300 text-xs uppercase font-bold tracking-wider">Nazwa Pracy / Klient</span>
            <input 
              type="text" required
              className="mt-1 block w-full bg-slate-900 border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.jobName}
              onChange={e => setFormData({...formData, jobName: e.target.value})}
            />
          </label>

          <label className="block">
            <span className="text-slate-300 text-xs uppercase font-bold tracking-wider">Maszyna Docelowa</span>
            <select 
              className="mt-1 block w-full bg-slate-900 border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.targetMachine}
              onChange={e => setFormData({...formData, targetMachine: e.target.value})}
            >
              <option value="E5">E5</option>
              <option value="P5">P5</option>
              <option value="P7">P7</option>
              <option value="P7-11">P7-11</option>
            </select>
          </label>
        </div>

        {/* Wybór Komponentów */}
        <div className="space-y-4">
          <label className="block">
            <span className="text-slate-300 text-xs uppercase font-bold tracking-wider">Surowiec (Magazyn)</span>
            <select 
              className="mt-1 block w-full bg-slate-900 border-slate-700 rounded-lg text-white p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.rawMaterialId}
              onChange={e => setFormData({...formData, rawMaterialId: e.target.value})}
            >
              <option value="">Wybierz rolkę...</option>
              {options.materials.map((m) => (
                <option key={m.id} value={m.id}>{m.materialName} - {m.width}mm</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-slate-300 text-xs uppercase font-bold tracking-wider">Wykrojnik</span>
            <select 
              className="mt-1 block w-full bg-slate-900 border-slate-700 rounded-lg text-white p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.dieCutId}
              onChange={e => setFormData({...formData, dieCutId: e.target.value})}
            >
              <option value="">Wybierz wykrojnik...</option>
              {options.dieCuts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-slate-300 text-xs uppercase font-bold tracking-wider">Teczka Polimerów (Projekt)</span>
            <select 
              className="mt-1 block w-full bg-slate-900 border-slate-700 rounded-lg text-white p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.polymerId}
              onChange={e => setFormData({...formData, polymerId: e.target.value})}
            >
              <option value="">Wybierz projekt...</option>
              {options.polymers.content.map((p) => (
                <option key={p.id} value={p.id}>ID: {p.projectId} - {p.repeatTeeth}z</option>
              ))}
            </select>
          </label>
        </div>

        {/* Farby - Multiselect */}
        <div className="md:col-span-2">
           <label className="block">
            <span className="text-slate-300 text-xs uppercase font-bold tracking-wider">Wybierz Farby (Przytrzymaj CTRL)</span>
            <select 
              multiple
              className="mt-1 block w-full bg-slate-900 border-slate-700 rounded-lg text-white p-2.5 h-32 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.inkIds.map(String)}
              onChange={e => {
                const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                setFormData({...formData, inkIds: values});
              }}
            >
              {options.inks.map((i) => (
                <option key={i.id} value={i.id}>{i.colorName} ({i.inkType})</option>
              ))}
            </select>
          </label>
        </div>

        <div className="md:col-span-2 flex justify-end gap-4 mt-4 border-t border-slate-700 pt-6">
          <button 
            type="button" 
            onClick={() => navigate("/production-monitor")}
            className="px-6 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all font-medium"
          >
            Anuluj
          </button>
          <button 
            type="submit"
            className="px-10 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            Utwórz Zlecenie
          </button>
        </div>
      </form>
    </div>
  );
}