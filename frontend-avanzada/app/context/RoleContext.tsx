import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'ESTUDIANTE' | 'DOCENTE' | 'ADMINISTRATIVO';

export interface MockUser {
  userId: string;
  nombre: string;
  email: string;
  password: string;
  rol: Role;
}

// Mock "database" of registered users — pre-seeded with one per role
const SEED_USERS: MockUser[] = [
  { userId: 'u001', nombre: 'Ana García', email: 'estudiante@uni.edu', password: '123456', rol: 'ESTUDIANTE' },
  { userId: 'u002', nombre: 'Prof. Carlos Méndez', email: 'docente@uni.edu', password: '123456', rol: 'DOCENTE' },
  { userId: 'u003', nombre: 'Laura Torres', email: 'admin@uni.edu', password: '123456', rol: 'ADMINISTRATIVO' },
];

function makeMockJwt(user: MockUser): string {
  const payload = { userId: user.userId, rol: user.rol, nombre: user.nombre, email: user.email };
  return btoa(JSON.stringify(payload));
}

function decodeToken(token: string): MockUser | null {
  try {
    const payload = JSON.parse(atob(token));
    return payload as MockUser;
  } catch {
    return null;
  }
}

interface AuthContextType {
  currentUser: MockUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (nombre: string, email: string, password: string, rol: Role) => { ok: boolean; error?: string };
  logout: () => void;
}

const RoleContext = createContext<AuthContextType | null>(null);

// Persist registered users across renders
let registeredUsers: MockUser[] = [...SEED_USERS];

export function RoleProvider({ children }: { children: ReactNode }) {
  const storedToken = localStorage.getItem('token');
  const storedUser = storedToken ? decodeToken(storedToken) : null;

  const [currentUser, setCurrentUser] = useState<MockUser | null>(storedUser);

  const login = (email: string, password: string): { ok: boolean; error?: string } => {
    const user = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, error: 'Credenciales incorrectas. Verifique su correo y contraseña.' };
    const token = makeMockJwt(user);
    localStorage.setItem('token', token);
    setCurrentUser(user);
    return { ok: true };
  };

  const register = (
    nombre: string,
    email: string,
    password: string,
    rol: Role
  ): { ok: boolean; error?: string } => {
    const exists = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return { ok: false, error: 'Ya existe una cuenta con ese correo electrónico.' };
    const newUser: MockUser = {
      userId: `u${Date.now()}`,
      nombre,
      email,
      password,
      rol,
    };
    registeredUsers = [...registeredUsers, newUser];
    const token = makeMockJwt(newUser);
    localStorage.setItem('token', token);
    setCurrentUser(newUser);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  return (
    <RoleContext.Provider
      value={{
        currentUser,
        role: currentUser?.rol ?? null,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used inside RoleProvider');
  return ctx;
}
