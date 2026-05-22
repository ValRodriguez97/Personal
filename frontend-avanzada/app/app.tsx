'use client';

import '@/index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoleProvider } from '@/app/context/RoleContext';
import { Layout } from '@/app/components/Layout';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { LoginPage } from '@/app/pages/LoginPage';
import { RegisterPage } from '@/app/pages/RegisterPage';
import { SolicitudesPage } from '@/app/pages/SolicitudesPage';
import { NuevaSolicitudPage } from '@/app/pages/NuevaSolicitudPage';
import { DetalleSolicitudPage } from '@/app/pages/DetalleSolicitudPage';
import { GestionUsuariosPage } from '@/app/pages/GestionUsuariosPage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/solicitudes" replace />} />
              <Route path="/solicitudes" element={<SolicitudesPage />} />
              <Route path="/solicitudes/nueva" element={<NuevaSolicitudPage />} />
              <Route path="/solicitudes/:id" element={<DetalleSolicitudPage />} />
              <Route path="/usuarios" element={<GestionUsuariosPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </RoleProvider>
  );
}

export default App;
