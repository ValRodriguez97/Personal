import { useRole, Role } from '@/app/context/RoleContext';
import { UserCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

const ROLE_LABELS: Record<Role, string> = {
  ESTUDIANTE: 'Estudiante',
  DOCENTE: 'Docente',
  ADMINISTRATIVO: 'Administrativo',
};

const ROLE_BADGE_STYLE: Record<Role, string> = {
  ESTUDIANTE: 'bg-blue-100 text-blue-800',
  DOCENTE: 'bg-purple-100 text-purple-800',
  ADMINISTRATIVO: 'bg-amber-100 text-amber-800',
};

export function Navbar() {
  const { currentUser, role, logout } = useRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!currentUser || !role) return null;

  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 shadow-sm z-10">
      <span className="text-[#2E7D32] font-semibold text-sm tracking-wide uppercase hidden sm:block">
        Sistema de Gestión de Solicitudes Académicas
      </span>

      <div className="flex items-center gap-3 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted text-sm text-foreground transition-colors cursor-pointer">
            <UserCircle className="w-4 h-4 text-[#2E7D32]" />
            <span className="font-medium">{currentUser.nombre}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${ROLE_BADGE_STYLE[role]}`}>
              {ROLE_LABELS[role]}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground">{currentUser.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
