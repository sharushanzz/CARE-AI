import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {}
    const t = setTimeout(() => navigate('/login'), 800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-20 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center">
        <h2 className="text-2xl font-semibold">You are signed out</h2>
        <p className="mt-4 text-slate-400">Thanks — we've cleared your session. Redirecting to sign in…</p>
        <div className="mt-6">
          <button onClick={() => navigate('/login')} className="rounded-2xl bg-emerald-500 px-4 py-2 font-medium text-white">Go to Sign In</button>
        </div>
      </div>
    </div>
  );
}
