import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse, Sparkles, Bot, FileText, CalendarDays } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3 text-xl font-semibold"><div className="rounded-2xl bg-emerald-500/20 p-2 text-emerald-400"><HeartPulse size={20} /></div>CARE-AI</div>
        <nav className="hidden gap-6 md:flex">{navItems.map(item => <NavLink key={item.to} to={item.to} className={({ isActive }) => `text-sm transition ${isActive ? 'text-emerald-400' : 'text-slate-300 hover:text-emerald-400'}`}>{item.label}</NavLink>)}</nav>
      </header>
      <main className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 lg:grid-cols-2 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300"><Sparkles size={16}/> Making healthcare simple, smart, accessible</div>
          <h1 className="text-5xl font-semibold leading-tight text-white md:text-7xl">AI healthcare for every family.</h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">Securely manage reports, reminders, family members, and care conversations in one trusted experience.</p>
          <div className="mt-8 flex gap-4">
            <Link to="/register" className="rounded-full bg-emerald-500 px-6 py-3 font-medium text-white hover:bg-emerald-400">Get Started</Link>
            <Link to="/dashboard" className="rounded-full border border-slate-700 px-6 py-3 font-medium text-slate-200 hover:border-emerald-400">Open Dashboard</Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur">
          <div className="grid gap-4">
            {[
              { icon: FileText, title: 'AI Report Explainer', desc: 'Understand lab reports in plain language.' },
              { icon: Bot, title: 'Healthcare Copilot', desc: 'Ask questions about medications, diet, and symptoms.' },
              { icon: CalendarDays, title: 'Reminders & Appointments', desc: 'Stay ahead of medicine and visit schedules.' }
            ].map((card) => <div key={card.title} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400"><card.icon size={18}/></div><div><h3 className="font-medium text-white">{card.title}</h3><p className="text-sm text-slate-400">{card.desc}</p></div></div></div>)}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
