import { useEffect, useState } from "react";
import { fetchDieCuts } from "../api/dieCuts";
import type { DieCut, DieCutPage } from "../api/dieCuts";
import { Link } from "react-router-dom";

export default function DieCutsList() {
  const [data, setData] = useState<DieCutPage | null>(null);
  const [loading, setLoading] = useState(false);

  // FILTRY
  const [status, setStatus] = useState("");
  const [dieNumber, setDieNumber] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // PAGINACJA
  const [page, setPage] = useState(0);

  // SORTOWANIE
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);

  // 🔥 Funkcja zmieniająca sortowanie
  const toggleSort = (field: string) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortField(null);
      setSortDir(null);
    }
    setPage(0);
  };

  // 🔥 Pobieranie danych
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const sortParam =
        sortField && sortDir ? `${sortField},${sortDir}` : undefined;

      const res = await fetchDieCuts({
        page,
        size: 20,
        status: status || undefined,
        projectId: projectId ? Number(projectId) : undefined,
        dieNumber: dieNumber || undefined,
        machine: undefined, // jeśli nie masz filtra po maszynie
        createdDateFrom: dateFrom || undefined,
        createdDateTo: dateTo || undefined,
        sort: sortParam,
      });


      setData(res);
      setLoading(false);
    };

    load();
  }, [page, status, projectId, dieNumber, sortField, sortDir, dateFrom, dateTo]);

  // 🔥 Ikona sortowania
  const sortIcon = (field: string) => {
    if (sortField !== field) return "↕";
    if (sortDir === "asc") return "▲";
    if (sortDir === "desc") return "▼";
    return "↕";
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Wykrojniki</h1>

      {/* PANEL FILTRÓW */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-6 space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* STATUS */}
          <select
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
          >
            <option value="">Wszystkie statusy</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="ARCHIVED">ARCHIVED</option>
            <option value="AWAY">AWAY</option>
          </select>

          {/* PROJEKT */}
          <input
            type="number"
            placeholder="ID projektu"
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded"
            value={projectId}
            onChange={(e) => {
              setProjectId(e.target.value);
              setPage(0);
            }}
          />

          {/* DATA OD */}
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded"
          />

          {/* DATA DO */}
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setPage(0)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Filtruj
          </button>

          <button
            onClick={() => {
              setStatus("");
              setProjectId("");
              setDieNumber("");
              setDateFrom("");
              setDateTo("");
              setSortField(null);
              setSortDir(null);
              setPage(0);
            }}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded"
          >
            Wyczyść
          </button>
        </div>
      </div>

      {loading && <div>Ładowanie...</div>}

      {!loading && data && (
        <>
          <table className="w-full text-sm border-separate border-spacing-0 rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-slate-800 text-slate-200">

                <th
                  className="px-4 py-3 text-left border-b border-slate-700 cursor-pointer select-none"
                  onClick={() => toggleSort("id")}
                >
                  ID {sortIcon("id")}
                </th>

                <th
                  className="px-4 py-3 text-left border-b border-slate-700 cursor-pointer select-none"
                  onClick={() => toggleSort("dieNumber")}
                >
                  Numer {sortIcon("dieNumber")}
                </th>

                <th
                  className="px-4 py-3 text-left border-b border-slate-700 cursor-pointer select-none"
                  onClick={() => toggleSort("projectId")}
                >
                  Projekt {sortIcon("projectId")}
                </th>

                <th
                  className="px-4 py-3 text-left border-b border-slate-700 cursor-pointer select-none"
                  onClick={() => toggleSort("status")}
                >
                  Status {sortIcon("status")}
                </th>

                <th className="px-4 py-3 text-left border-b border-slate-700">
                  Maszyna
                </th>

                <th className="px-4 py-3 text-left border-b border-slate-700">
                  Lokalizacja
                </th>

                <th
                  className="px-4 py-3 text-left border-b border-slate-700 cursor-pointer select-none"
                  onClick={() => toggleSort("createdDate")}
                >
                  Data {sortIcon("createdDate")}
                </th>
              </tr>
            </thead>

            <tbody>
              {data.content.map((d: DieCut) => (
                <tr
                  key={d.id}
                  className="bg-slate-900 hover:bg-slate-800 transition-colors"
                >
                  <td className="px-4 py-3 border-b border-slate-800">
                    <Link
                      className="text-blue-400 hover:underline"
                      to={`/die-cuts/${d.id}`}
                    >
                      {d.id}
                    </Link>
                  </td>

                  <td className="px-4 py-3 border-b border-slate-800">
                    {d.dieNumber}
                  </td>

                  {/* PROJEKT */}
                  <td className="px-4 py-3 border-b border-slate-800">
                    {d.projectId}
                  </td>

                  {/* STATUS z kolorem AWAY */}
                  <td className="px-4 py-3 border-b border-slate-800 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        d.status === "ACTIVE"
                          ? "bg-green-700 text-green-100"
                        : d.status === "INACTIVE"
                          ? "bg-yellow-700 text-yellow-100"
                        : d.status === "AWAY"
                          ? "bg-blue-700 text-blue-100"
                        : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>

                  {/* MASZYNA */}
                  <td className="px-4 py-3 border-b border-slate-800">
                    {d.machine || "-"}
                  </td>

                  {/* LOKALIZACJA */}
                  <td className="px-4 py-3 border-b border-slate-800">
                    {d.storageLocation}
                  </td>

                  {/* DATA */}
                  <td className="px-4 py-3 border-b border-slate-800">
                    {new Date(d.createdDate).toLocaleDateString("pl-PL")}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          {/* PAGINACJA */}
          <div className="flex items-center justify-between mt-6">

            {/* Informacja o zakresie */}
            <div className="text-sm text-slate-400">
              Wyświetlam{" "}
              <span className="text-slate-200 font-medium">
                {data.number * data.size + 1}
              </span>{" "}
              –{" "}
              <span className="text-slate-200 font-medium">
                {Math.min((data.number + 1) * data.size, data.totalElements)}
              </span>{" "}
              z{" "}
              <span className="text-slate-200 font-medium">
                {data.totalElements}
              </span>
            </div>

            {/* Przyciski paginacji */}
            <div className="flex gap-2">

              {/* Poprzednia */}
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className={`px-3 py-2 rounded border border-slate-700 ${
                  page === 0
                    ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                Poprzednia
              </button>

              {/* Numery stron */}
              {Array.from({ length: data.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`px-3 py-2 rounded border border-slate-700 ${
                    page === i
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {/* Następna */}
              <button
                disabled={page === data.totalPages - 1}
                onClick={() =>
                  setPage((p) => Math.min(data.totalPages - 1, p + 1))
                }
                className={`px-3 py-2 rounded border border-slate-700 ${
                  page === data.totalPages - 1
                    ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                Następna
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

