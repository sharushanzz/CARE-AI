import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Activity, HeartPulse, ShieldCheck, Sparkles, Bot, FileText, CalendarDays, Stethoscope, UserCircle2, LayoutDashboard, Users, ClipboardList, Pill, AlertTriangle, Settings, BrainCircuit } from 'lucide-react';

const sidebarItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/family', label: 'Family', icon: Users },
  { to: '/reports', label: 'Reports', icon: ClipboardList },
  { to: '/ai-explainer', label: 'AI Explainer', icon: BrainCircuit },
  { to: '/analytics', label: 'Analytics', icon: Activity },
  { to: '/reminders', label: 'Reminders', icon: Pill },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/chatbot', label: 'Chatbot', icon: Bot },
  { to: '/emergency', label: 'Emergency', icon: AlertTriangle },
  { to: '/doctor-summary', label: 'Doctor Summary', icon: Stethoscope },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/admin', label: 'Admin', icon: ShieldCheck },
  { to: '/logout', label: 'Sign Out', icon: UserCircle2 }
];

export function PageShell({ title, description, children }) {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold">{title}</h2>
            <p className="mt-2 text-slate-400">{description}</p>
          </div>
          <Link to="/" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">Back Home</Link>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-800 bg-slate-900/70 p-4 lg:w-72 lg:border-b-0 lg:border-r">
          <div className="mb-6 flex items-center gap-3 px-2 text-xl font-semibold">
            <div className="rounded-2xl bg-emerald-500/20 p-2 text-emerald-400"><HeartPulse size={20} /></div>
            CARE-AI
          </div>
          <nav className="space-y-2">
            {sidebarItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${isActive ? 'bg-emerald-500/15 text-emerald-300' : 'text-slate-300 hover:bg-slate-800'}`}>
                <Icon size={18} />{label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export function Section({ title, body }) {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/70 p-10">
        <h2 className="text-3xl font-semibold">{title}</h2>
        <p className="mt-4 text-slate-400">{body}</p>
      </div>
    </div>
  );
}

export function AuthCard({ title, subtitle, buttonLabel, mode = 'login' }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const url = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body = mode === 'register' ? { name, email, password } : { email, password };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Authentication failed');
      }
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(String(err.message || err));
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-20 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
        <div className="mb-4 flex items-center justify-between">
          <button type="button" onClick={() => navigate('/')} className="rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white">
            Back
          </button>
        </div>
        <h2 className="text-3xl font-semibold">{title}</h2>
        <p className="mt-2 text-slate-400">{subtitle}</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {mode === 'register' && (
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Full name" />
          )}
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" type="password" placeholder="Password" />
          {error && <div className="text-sm text-red-400">{error}</div>}
          <div className="flex gap-3">
            <button type="submit" className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 font-medium text-white">{buttonLabel}</button>
            {mode === 'login' && (
              <button type="button" onClick={fillAdmin} className="rounded-2xl border border-slate-700 px-4 py-3 text-sm text-slate-200">Use admin</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
