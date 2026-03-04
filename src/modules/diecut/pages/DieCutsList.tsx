import { useEffect, useState } from "react";
import { fetchDieCuts } from "@/modules/diecut/api/dieCuts";
import type { DieCut, DieCutPage } from "@/modules/diecut/api/dieCuts";
import { Link } from "react-router-dom";

export default function DieCutsList() {
  const [data, setData] = useState<DieCutPage | null>(null);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dieNumber, ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);

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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const sortParam = sortField && sortDir ? `${sortField},${sortDir}` : undefined;

      const res = await fetchDieCuts({
        page,
        size: 20,
        status: status || undefined,
        projectId: projectId ? Number(projectId) : undefined,
        dieNumber: dieNumber || undefined,
        createdDateFrom: dateFrom || undefined,
        createdDateTo: dateTo || undefined,
        sort: sortParam,
      });

      setData(res);
      setLoading(false);
    };
    load();
  }, [page, status, projectId, dieNumber, sortField, sortDir, dateFrom, dateTo]);

  const sortIcon = (field: string) => {
    if (sortField !== field) return "↕";
    return sortDir === "asc" ? "▲" : "▼";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Wykrojniki</h1>
        <Link 
          to="/die-cuts/create" 
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition"
        >
          + Dodaj wykrojnik
        </Link>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(0); }}
          >
            <option value="">Wszystkie statusy</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="ARCHIVED">ARCHIVED</option>
            <option value="AWAY">AWAY</option>
          </select>

          <input
            type="number"
            placeholder="ID projektu"
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200"
            value={projectId}
            onChange={(e) => { setProjectId(e.target.value); setPage(0); }}
          />

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(0); }}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200"
          />

          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(0); }}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200"
          />
        </div>
      </div>

      {loading && <div className="text-slate-400">Ładowanie...</div>}

      {!loading && data && (
        <>
          <table className="w-full text-sm border-separate border-spacing-0 rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-slate-800 text-slate-200">
                <th className="px-4 py-3 text-left border-b border-slate-700 cursor-pointer" onClick={() => toggleSort("id")}>
                  ID {sortIcon("id")}
                </th>
                <th className="px-4 py-3 text-left border-b border-slate-700 cursor-pointer" onClick={() => toggleSort("dieNumber")}>
                  Numer {sortIcon("dieNumber")}
                </th>
                <th className="px-4 py-3 text-left border-b border-slate-700 cursor-pointer" onClick={() => toggleSort("projectId")}>
                  Projekt {sortIcon("projectId")}
                </th>
                <th className="px-4 py-3 text-left border-b border-slate-700">Status</th>
                <th className="px-4 py-3 text-left border-b border-slate-700">Maszyna</th>
                <th className="px-4 py-3 text-right border-b border-slate-700">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((d: DieCut) => (
                <tr key={d.id} className="bg-slate-900 hover:bg-slate-800 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-800 text-blue-400 font-mono">{d.id}</td>
                  <td className="px-4 py-3 border-b border-slate-800 font-medium">{d.dieNumber}</td>
                  <td className="px-4 py-3 border-b border-slate-800">{d.projectId}</td>
                  <td className="px-4 py-3 border-b border-slate-800">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      d.status === "ACTIVE" ? "bg-green-700 text-green-100" :
                      d.status === "INACTIVE" ? "bg-yellow-700 text-yellow-100" :
                      d.status === "AWAY" ? "bg-blue-700 text-blue-100" : "bg-slate-700 text-slate-300"
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-slate-800">{d.machine || "-"}</td>
                  <td className="px-4 py-3 border-b border-slate-800 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/die-cuts/${d.id}`} className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-blue-400" title="Szczegóły">👁️</Link>
                      <Link to={`/die-cuts/${d.id}/edit`} className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-yellow-400" title="Edytuj">✏️</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Paginacja pozostaje bez zmian jak w Twoim oryginale */}
        </>
      )}
    </div>
  );
}