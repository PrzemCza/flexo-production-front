import { Link, Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();

  const menu = [
    { label: "Monitor Produkcji", path: "/production-monitor" }, // NOWOŚĆ
    { label: "Wykrojniki", path: "/die-cuts" },
    { label: "Dodaj wykrojnik", path: "/die-cuts/create" },
    { label: "Magazyn Surowców", path: "/raw-materials" }, 
    { label: "Przyjmij surowiec", path: "/raw-materials/create" }, 
    { label: "Magazyn Farb", path: "/inks" }, 
    { label: "Dodaj farbę", path: "/inks/create" }, 
    { label: "Magazyn Polimerów", path: "/polymers" },
    { label: "Dodaj polimer", path: "/polymers/create" },
  ];

  // MAPA STATYCZNYCH ŚCIEŻEK
  const breadcrumbMap: Record<string, string[]> = {
    "/production-monitor": ["Produkcja", "Monitor Live"], // NOWOŚĆ
    "/die-cuts": ["Wykrojniki"],
    "/die-cuts/create": ["Wykrojniki", "Dodaj"],
    "/raw-materials": ["Magazyn"],
    "/raw-materials/create": ["Magazyn", "Przyjęcie"],
    "/inks": ["Magazyn Farb"],
    "/inks/create": ["Magazyn Farb", "Nowy pojemnik"],
    "/polymers": ["Polimery"],
    "/polymers/create": ["Polimery", "Dodaj"],
  };

  // OBSŁUGA ŚCIEŻEK DYNAMICZNYCH
  function resolveDynamicBreadcrumb(pathname: string): string[] {
    // Monitor Produkcji (przyszłościowe detale zlecenia)
    if (/^\/production-monitor\/\d+$/.test(pathname)) return ["Produkcja", "Szczegóły zlecenia"];

    // Wykrojniki
    if (/^\/die-cuts\/\d+$/.test(pathname)) return ["Wykrojniki", "Szczegóły"];
    if (/^\/die-cuts\/\d+\/edit$/.test(pathname)) return ["Wykrojniki", "Szczegóły", "Edycja"];

    // Surowce
    if (/^\/raw-materials\/\d+$/.test(pathname)) return ["Magazyn", "Szczegóły rolki"];
    if (/^\/raw-materials\/\d+\/edit$/.test(pathname)) return ["Magazyn", "Edycja"];

    // Farby
    if (/^\/inks\/\d+$/.test(pathname)) return ["Magazyn Farb", "Szczegóły farby"];
    if (/^\/inks\/\d+\/edit$/.test(pathname)) return ["Magazyn Farb", "Edycja"];

    // Polimery
    if (/^\/polymers\/\d+$/.test(pathname)) return ["Polimery", "Szczegóły formy"];
    if (/^\/polymers\/\d+\/edit$/.test(pathname)) return ["Polimery", "Edycja"];

    return ["Flexo Manager"];
  }

  const crumbs =
    breadcrumbMap[location.pathname] ??
    resolveDynamicBreadcrumb(location.pathname);

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col shadow-xl z-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">F</div>
          <h1 className="text-xl font-bold text-white tracking-tight">Flexo Manager</h1>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            const isProduction = item.path === "/production-monitor";

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                  isActive 
                    ? "bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/25 translate-x-1" 
                    : isProduction 
                      ? "text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20" 
                      : "text-slate-400 hover:bg-slate-700 hover:text-slate-100"
                }`}
              >
                {isProduction && !isActive && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-700 text-[10px] text-slate-500 uppercase tracking-widest flex justify-between items-center">
          <span>System v1.2.5</span>
          <span className="text-emerald-500/50">Online</span>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtelny gradient w tle dla głębi */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/5 blur-[120px] pointer-events-none" />

        {/* TOPBAR */}
        <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 px-8 py-5 flex items-center justify-between shadow-sm z-10">
          <h2 className="text-xl font-bold text-white">
            {menu.find((m) => m.path === location.pathname)?.label || crumbs[crumbs.length - 1]}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-200 leading-none">Admin User</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Produkcja / Planowanie</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 border border-indigo-400 flex items-center justify-center shadow-lg text-sm font-black text-white">
              AD
            </div>
          </div>
        </header>

        {/* BREADCRUMB */}
        <nav className="text-[10px] uppercase font-bold tracking-[0.15em] text-slate-500 px-8 py-3.5 flex gap-2 items-center bg-slate-900/80 border-b border-slate-800/50">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-700">/</span>}
              <span className={i === crumbs.length - 1 ? "text-indigo-400" : "hover:text-slate-300 cursor-default transition-colors"}>{c}</span>
            </span>
          ))}
        </nav>

        {/* PAGE CONTENT */}
        <main className="p-8 overflow-y-auto flex-1 bg-slate-900 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}