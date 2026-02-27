import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getDieCut, deleteDieCut } from "@/modules/diecut/api/dieCuts";
import type { DieCut } from "@/modules/diecut/api/dieCuts";
import { useToast } from '@/shared/hooks/useToast';
import ConfirmModal from "@/shared/components/ConfirmModal";

export default function DieCutDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [data, setData] = useState<DieCut | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
      const dieId = Number(id);
      
      // Jeśli id to "create" lub inny tekst, nie rób zapytania
      if (isNaN(dieId)) return; 

      const load = async () => {
        setLoading(true); // Ustaw ładowanie na true przy zmianie ID
        try {
          const result = await getDieCut(dieId);
          setData(result);
        } catch (err) {
          console.error("Błąd pobierania:", err);
        } finally {
          setLoading(false);
        }
      };

      load();
    }, [id]);

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDieCut(Number(id));
      showToast("Wykrojnik został usunięty.", "success");
      navigate("/");
    } catch (err) {
      console.error("Błąd usuwania:", err);
      showToast("Nie udało się usunąć wykrojnika.", "error");
    } finally {
      setConfirmOpen(false);
    }
  };

  if (loading) return <div>Ładowanie...</div>;
  if (!data) return <div>Nie znaleziono wykrojnika.</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Szczegóły wykrojnika</h1>

      <div className="space-y-2">
        <p><strong>ID:</strong> {data.id}</p>
        <p><strong>Numer:</strong> {data.dieNumber}</p>
        <p><strong>Projekt:</strong> {data.projectId}</p>
        <p><strong>Status:</strong> {data.status}</p>
        <p><strong>Lokalizacja:</strong> {data.storageLocation}</p>
        <p><strong>Data utworzenia:</strong> {data.createdDate}</p>
        <p><strong>Notatki:</strong> {data.notes}</p>
      </div>

      <div className="mt-6 flex gap-4">
        <Link
          to={`/die-cuts/${data.id}/edit`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Edytuj
        </Link>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Usuń
        </button>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Potwierdzenie usunięcia"
        message="Czy na pewno chcesz usunąć ten wykrojnik? Tej operacji nie można cofnąć."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
