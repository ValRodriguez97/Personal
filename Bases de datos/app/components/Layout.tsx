import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  Trophy,
  CalendarDays,
  Building2,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  ClipboardList
} from "lucide-react";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Trophy, label: "Equipos", path: "/teams" },
    { icon: Users, label: "Jugadores", path: "/players" },
    { icon: CalendarDays, label: "Partidos", path: "/matches" },
    { icon: Building2, label: "Estadios", path: "/stadiums" },
    { icon: BarChart3, label: "Consultas", path: "/queries" },
    { icon: FileText, label: "Reportes", path: "/reports" },
    { icon: Settings, label: "Usuarios", path: "/users" },
    { icon: ClipboardList, label: "Bitácora", path: "/audit-log" },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-world-cup-purple to-world-cup-magenta flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">FIFA 2026</h1>
              <p className="text-xs text-sidebar-foreground/60">Admin System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-world-cup-blue to-world-cup-turquoise flex items-center justify-center text-white font-semibold">
              AD
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Administrador</p>
              <p className="text-xs text-sidebar-foreground/60">admin@fifa2026.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
