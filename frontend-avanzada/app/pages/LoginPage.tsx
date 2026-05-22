import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRole } from '@/app/context/RoleContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GraduationCap, AlertCircle, Loader2 } from 'lucide-react';

export function LoginPage() {
  const { login } = useRole();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.ok) {
        navigate('/solicitudes', { replace: true });
      } else {
        setError(result.error || 'Error desconocido');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header branding */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-[#2E7D32] flex items-center justify-center shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#1B5E20] text-center">Sistema Académico</h1>
          <p className="text-sm text-muted-foreground text-center">Gestión de Solicitudes Universitarias</p>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-[#212121]">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@uni.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Ingresar
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-[#2E7D32] font-medium hover:underline">
                Regístrate aquí
              </Link>
            </div>

            {/* Demo hint */}
            <div className="mt-4 rounded-md bg-[#E8F5E9] border border-[#A5D6A7] p-3 text-xs text-[#1B5E20] space-y-1">
              <p className="font-semibold">Cuentas de demo:</p>
              <p>📘 Estudiante: <span className="font-mono">estudiante@uni.edu</span> / 123456</p>
              <p>📗 Docente: <span className="font-mono">docente@uni.edu</span> / 123456</p>
              <p>📙 Administrativo: <span className="font-mono">admin@uni.edu</span> / 123456</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
