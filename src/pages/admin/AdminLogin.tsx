import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/lib/admin/useAdminAuth';

export function AdminLogin() {
  const isAuthenticated = useAdminAuth((s) => s.isAuthenticated);
  const login = useAdminAuth((s) => s.login);
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={(location.state as { from?: string })?.from ?? '/admin'} replace />;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!login(password)) {
      setError(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-bg">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-xl border border-neutral-text/10 p-6">
        <h1 className="font-heading text-xl font-bold mb-4">Login Admin</h1>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            autoFocus
          />
          {error && <p className="text-sm text-red-600">Password salah.</p>}
        </div>
        <Button type="submit" className="w-full mt-4">
          Masuk
        </Button>
      </form>
    </div>
  );
}
