import { NavLink } from 'react-router-dom';
import { FileText, PlusCircle, Users, ClipboardList, AlertCircle, GraduationCap } from 'lucide-react';
import { useRole } from '@/app/context/RoleContext';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  const { role } = useRole();

  const navItems: NavItem[] = (() => {
    if (role === 'ESTUDIANTE') {
      return [
        { label: 'Mis Solicitudes', to: '/solicitudes', icon: <FileText className="w-4 h-4" /> },
        { label: 'Nueva Solicitud', to: '/solicitudes/nueva', icon: <PlusCircle className="w-4 h-4" /> },
      ];
    }
    if (role === 'DOCENTE') {
      return [
        { label: 'Todas las Solicitudes', to: '/solicitudes', icon: <ClipboardList className="w-4 h-4" /> },
        { label: 'Mis Acciones Pendientes', to: '/solicitudes?estado=CLASIFICADA', icon: <AlertCircle className="w-4 h-4" /> },
      ];
    }
    // ADMINISTRATIVO
    return [
      { label: 'Todas las Solicitudes', to: '/solicitudes', icon: <ClipboardList className="w-4 h-4" /> },
      { label: 'Gestión de Usuarios', to: '/usuarios', icon: <Users className="w-4 h-4" /> },
    ];
  })();

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-sidebar text-sidebar-foreground shadow-lg">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-sidebar-border">
        <GraduationCap className="w-7 h-7 text-white" />
        <div>
          <p className="text-white font-bold text-sm leading-tight">Sistema Académico</p>
          <p className="text-white/60 text-xs">Gestión de Solicitudes</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/solicitudes'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-white/80 hover:bg-sidebar-accent hover:text-white'
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-sidebar-border">
        <p className="text-white/40 text-xs">© 2026 Universidad</p>
      </div>
    </aside>
  );
}
