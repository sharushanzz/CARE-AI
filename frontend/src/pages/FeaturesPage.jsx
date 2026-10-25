import { Link } from 'react-router-dom';
import { Activity, ArrowLeft, BellRing, Bot, FileText, HeartPulse, QrCode, ShieldCheck, UsersRound } from 'lucide-react';

const features = [
  { icon: ShieldCheck, title: 'Secure health locker', text: 'Keep profiles, reports, prescriptions, and important documents organized in one private workspace.', color: 'text-emerald-300' },
  { icon: Bot, title: 'AI health explainer', text: 'Turn complex medical language into clear, practical summaries you can discuss with your care team.', color: 'text-cyan-300' },
  { icon: FileText, title: 'Smart document capture', text: 'Upload health documents and extract the details that matter without losing the original file.', color: 'text-amber-300' },
  { icon: BellRing, title: 'Care reminders', text: 'Stay on top of medicines, appointments, and health routines with timely reminders.', color: 'text-rose-300' },
  { icon: QrCode, title: 'Emergency access', text: 'Share essential emergency information quickly with a scannable QR profile.', color: 'text-orange-300' },
  { icon: Activity, title: 'Health analytics', text: 'See trends across your care activity and make progress easier to understand.', color: 'text-violet-300' },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="text-sm font-medium text-emerald-300 hover:text-emerald-200">CARE-AI</Link>
            <Link to="/" className="flex items-center gap-2 rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white"><ArrowLeft size={16} />Back home</Link>
          </div>
          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">One calmer place for care</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Your health story, made easier to act on.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-400">CARE-AI brings the information, reminders, people, and context around your health into one thoughtful workspace.</p>
        </header>

        <section className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text, color }) => (
            <article key={title} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-slate-600">
              <div className={`mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 ${color}`}><Icon size={22} /></div>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-3 leading-7 text-slate-400">{text}</p>
            </article>
          ))}
        </section>

        <section className="mt-14 grid gap-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="flex items-center gap-3 text-emerald-300"><HeartPulse size={20} /><span className="text-sm font-semibold uppercase tracking-widest">Built around real care</span></div>
            <h2 className="mt-4 text-2xl font-semibold">From everyday routines to unexpected moments.</h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-300">Invite trusted family members, prepare a doctor-ready summary, or make critical details available when time matters.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300"><UsersRound size={18} className="text-emerald-300" />Family-ready</div>
        </section>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/register" className="rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300">Create your space</Link>
          <Link to="/pricing" className="rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 hover:border-slate-500">View plans</Link>
        </div>
      </div>
    </main>
  );
}
