import { Link, Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();

  const menu = [
    { label: "Wykrojniki", path: "/die-cuts" },
    { label: "Dodaj wykrojnik", path: "/die-cuts/create" },
    { label: "Magazyn Surowców", path: "/raw-materials" }, 
    { label: "Przyjmij surowiec", path: "/raw-materials/create" }, 
    { label: "Magazyn Farb", path: "/inks" }, 
    { label: "Dodaj farbę", path: "/inks/create" }, 
  ];

  // MAPA STATYCZNYCH ŚCIEŻEK
  const breadcrumbMap: Record<string, string[]> = {
    "/die-cuts": ["Wykrojniki"],
    "/die-cuts/create": ["Wykrojniki", "Dodaj"],
    "/raw-materials": ["Magazyn"],
    "/raw-materials/create": ["Magazyn", "Przyjęcie"],
    "/inks": ["Magazyn Farb"],
    "/inks/create": ["Magazyn Farb", "Nowy pojemnik"],
  };

  // OBSŁUGA ŚCIEŻEK DYNAMICZNYCH
  function resolveDynamicBreadcrumb(pathname: string): string[] {
    // Wykrojniki
    if (/^\/die-cuts\/\d+$/.test(pathname)) return ["Wykrojniki", "Szczegóły"];
    if (/^\/die-cuts\/\d+\/edit$/.test(pathname)) return ["Wykrojniki", "Szczegóły", "Edycja"];

    // Surowce
    if (/^\/raw-materials\/\d+$/.test(pathname)) return ["Magazyn", "Szczegóły rolki"];
    if (/^\/raw-materials\/\d+\/edit$/.test(pathname)) return ["Magazyn", "Edycja"];

    // Farby (NOWE)
    if (/^\/inks\/\d+$/.test(pathname)) return ["Magazyn Farb", "Szczegóły farby"];
    if (/^\/inks\/\d+\/edit$/.test(pathname)) return ["Magazyn Farb", "Edycja"];

    return ["Flexo Manager"];
  }

  const crumbs =
    breadcrumbMap[location.pathname] ??
    resolveDynamicBreadcrumb(location.pathname);

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col shadow-xl">
        <h1 className="text-xl font-bold mb-6 text-indigo-400 tracking-tight">Flexo Manager</h1>

        <nav className="flex flex-col gap-2">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-500/20" 
                    : "text-slate-400 hover:bg-slate-700 hover:text-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-700 text-[10px] text-slate-500 uppercase tracking-widest">
          System v1.2.0-beta
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm">
          <h2 className="text-lg font-semibold text-slate-100">
            {menu.find((m) => m.path === location.pathname)?.label || crumbs[crumbs.length - 1]}
          </h2>
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-400">
            AD
          </div>
        </header>

        {/* BREADCRUMB */}
        <nav className="text-[11px] uppercase tracking-wider text-slate-500 px-6 py-3 flex gap-2 items-center bg-slate-900/50">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-700">/</span>}
              <span className={i === crumbs.length - 1 ? "text-slate-300 font-bold" : ""}>{c}</span>
            </span>
          ))}
        </nav>

        {/* PAGE CONTENT */}
        <main className="p-6 overflow-y-auto flex-1 bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}