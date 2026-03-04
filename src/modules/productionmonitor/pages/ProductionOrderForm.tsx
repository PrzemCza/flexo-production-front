import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productionService, ProductionOrderRequest } from "../api/production";
import { ProjectOrderMonitor } from "../types/index";

// Importy bezpośrednich funkcji i serwisów
import { fetchMaterials } from "@/modules/rawmaterial/api/materials";
import { fetchDieCuts } from "@/modules/diecut/api/dieCuts";
import { polymerService } from "@/modules/polymer/api/polymers"; // Poprawny import serwisu
import { fetchInks } from "@/modules/ink/api/inks";

// Definicje typów pomocniczych
interface RawMaterialItem { id: number; batchNumber?: string; materialName?: string; }
interface DieCutItem { id: number; dieNumber: string; }
interface PolymerItem { id: number; projectId: string | number; }
interface InkItem { id: number; colorName?: string; name?: string; }

interface OrderOption {
  id: number;
  name: string;
}

interface OrderFormData {
  orderNumber: string;
  jobName: string;
  targetMachine: string;
  deadline: string;
  rawMaterialId: number | "";
  dieCutId: number | "";
  polymerId: number | "";
  inkIds: number[];
}

export default function ProductionOrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [materials, setMaterials] = useState<OrderOption[]>([]);
  const [dieCuts, setDieCuts] = useState<OrderOption[]>([]);
  const [polymers, setPolymers] = useState<OrderOption[]>([]);
  const [inks, setInks] = useState<OrderOption[]>([]);

  const [formData, setFormData] = useState<OrderFormData>({
    orderNumber: "",
    jobName: "",
    targetMachine: "P7",
    deadline: new Date().toISOString().split('T')[0],
    rawMaterialId: "",
    dieCutId: "",
    polymerId: "",
    inkIds: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const initForm = async () => {
      try {
        setLoading(true);

        // ROZWIĄZANIE BŁĘDU: Używamy polymerService.getAll({ size: 1000 })
        const [matsRes, diesRes, polysRes, inksRes] = await Promise.all([
          fetchMaterials({ size: 1000 }),
          fetchDieCuts({ size: 1000 }),
          polymerService.getAll({ size: 1000 }), // Przekazujemy wymagany parametr params
          fetchInks({ size: 1000 })
        ]);

        setMaterials(matsRes.content.map((m: RawMaterialItem) => ({ 
          id: m.id, 
          name: m.batchNumber || m.materialName || `Mat #${m.id}` 
        })));
        
        setDieCuts(diesRes.content.map((d: DieCutItem) => ({ 
          id: d.id, 
          name: d.dieNumber 
        })));
        
        // Obsługa polimerów (zakładając strukturę PolymerPage z polem content)
        const polyList = polysRes.content || [];
        setPolymers(polyList.map((p: PolymerItem) => ({ 
          id: p.id, 
          name: String(p.projectId || p.id) 
        })));
        
        setInks(inksRes.content.map((i: InkItem) => ({ 
          id: i.id, 
          name: i.colorName || i.name || `Ink #${i.id}` 
        })));

        if (isEditMode && id) {
          const data: ProjectOrderMonitor = await productionService.getById(Number(id));
          
          // DOSTOSOWANIE DO PŁASKIEGO index.ts (brak data.rawMaterial.id)
          setFormData({
            orderNumber: data.orderNumber || "",
            jobName: data.jobName || "",
            targetMachine: data.targetMachine || "P7",
            deadline: data.deadline || "",
            rawMaterialId: data.rawMaterialId ?? "",
            dieCutId: data.dieCutId ?? "",
            polymerId: data.polymerId ?? "",
            inkIds: data.inkIds ?? []
          });
        }
      } catch (error) {
        console.error("Błąd inicjalizacji:", error);
      } finally {
        setLoading(false);
      }
    };

    initForm();
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const processedValue = name.endsWith('Id') ? (value === "" ? "" : Number(value)) : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleInkToggle = (inkId: number) => {
    setFormData(prev => ({
      ...prev,
      inkIds: prev.inkIds.includes(inkId)
        ? prev.inkIds.filter(i => i !== inkId)
        : [...prev.inkIds, inkId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Przygotowanie payloadu (zamiana pustych ID na undefined dla backendu)
    const payload = {
      ...formData,
      rawMaterialId: formData.rawMaterialId === "" ? undefined : formData.rawMaterialId,
      dieCutId: formData.dieCutId === "" ? undefined : formData.dieCutId,
      polymerId: formData.polymerId === "" ? undefined : formData.polymerId,
    } as unknown as ProductionOrderRequest;

    try {
      if (isEditMode && id) {
        await productionService.update(Number(id), payload);
      } else {
        await productionService.create(payload);
      }
      navigate("/production-monitor");
    } catch (error) {
      console.error("Błąd zapisu:", error);
      alert("Wystąpił błąd podczas zapisywania.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-white animate-pulse font-bold text-center">ŁADOWANIE...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">
          {isEditMode ? `Edycja: ${formData.orderNumber}` : "Nowe Zlecenie"}
        </h1>
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white uppercase text-xs font-bold">
          Anuluj
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Numer Zlecenia</label>
            <input
              required
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Maszyna</label>
            <select
              name="targetMachine"
              value={formData.targetMachine}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-indigo-500"
            >
              <option value="P7">Mark Andy P7</option>
              <option value="P5">Mark Andy P5</option>
              <option value="EVOLUTION">Evolution</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Nazwa Pracy</label>
            <input
              required
              name="jobName"
              value={formData.jobName}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-700/50">
          {/* Select Surowiec */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Surowiec</label>
            <select
              required
              name="rawMaterialId"
              value={formData.rawMaterialId}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500"
            >
              <option value="">Wybierz...</option>
              {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>

          {/* Select Wykrojnik */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Wykrojnik</label>
            <select
              required
              name="dieCutId"
              value={formData.dieCutId}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500"
            >
              <option value="">Wybierz...</option>
              {dieCuts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          {/* Select Polimer */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Polimer</label>
            <select
              required
              name="polymerId"
              value={formData.polymerId}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500"
            >
              <option value="">Wybierz...</option>
              {polymers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-700/50">
          <label className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Farby</label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 bg-slate-900/80 rounded-xl border border-slate-700/50">
            {inks.map(ink => (
              <button
                key={ink.id}
                type="button"
                onClick={() => handleInkToggle(ink.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  formData.inkIds.includes(ink.id)
                    ? 'bg-amber-500 border-amber-400 text-slate-900 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {ink.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-xl shadow-indigo-500/20"
        >
          {saving ? "ZAPISYWANIE..." : isEditMode ? "ZAPISZ ZMIANY" : "UTWÓRZ ZLECENIE"}
        </button>
      </form>
    </div>
  );
}