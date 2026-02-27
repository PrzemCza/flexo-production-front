import { Link, Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();

  const menu = [
    { label: "Wykrojniki", path: "/" },
    { label: "Dodaj wykrojnik", path: "/die-cuts/new" },
  ];

  // MAPA STATYCZNYCH ŚCIEŻEK
  const breadcrumbMap: Record<string, string[]> = {
    "/": ["Wykrojniki"],
    "/die-cuts/new": ["Wykrojniki", "Dodaj"],
  };

  // OBSŁUGA ŚCIEŻEK DYNAMICZNYCH
  function resolveDynamicBreadcrumb(pathname: string): string[] {
    // /die-cuts/123
    if (/^\/die-cuts\/\d+$/.test(pathname)) {
      return ["Wykrojniki", "Szczegóły"];
    }

    // /die-cuts/123/edit
    if (/^\/die-cuts\/\d+\/edit$/.test(pathname)) {
      return ["Wykrojniki", "Szczegóły", "Edycja"];
    }

    return ["Wykrojniki"];
  }

  const crumbs =
    breadcrumbMap[location.pathname] ??
    resolveDynamicBreadcrumb(location.pathname);

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-6">Flexo Manager</h1>

        <nav className="flex flex-col gap-2">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded hover:bg-slate-700 ${
                location.pathname === item.path ? "bg-slate-700" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto text-xs text-slate-500">
          © {new Date().getFullYear()} Flexo Manager
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <h2 className="text-lg font-semibold">
            {menu.find((m) => m.path === location.pathname)?.label || "Szczegóły"}
          </h2>
        </header>

        {/* BREADCRUMB */}
        <nav className="text-sm text-slate-400 px-6 py-3 flex gap-2">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              <span>{c}</span>
            </span>
          ))}
        </nav>

        {/* PAGE CONTENT */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
