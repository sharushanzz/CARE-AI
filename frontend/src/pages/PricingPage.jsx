import { Link } from 'react-router-dom';
import { ArrowLeft, Check, HeartPulse, Sparkles } from 'lucide-react';
import { useState } from 'react';

const plans = [
  { name: 'Personal', monthly: 0, description: 'A simple starting point for your own health records.', features: ['Secure health locker', 'AI summaries', 'Reminders and appointments'], action: 'Start free', featured: false },
  { name: 'Family', monthly: 9, description: 'Keep the people you care for connected and prepared.', features: ['Everything in Personal', 'Family sharing for up to 5 people', 'Emergency QR profile', 'Priority support'], action: 'Choose Family', featured: true },
  { name: 'Care Pro', monthly: 19, description: 'More insight and control for complex care journeys.', features: ['Everything in Family', 'Advanced health analytics', 'Unlimited document storage', 'Doctor-ready reports'], action: 'Choose Pro', featured: false },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center justify-between gap-4">
              <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-emerald-300"><HeartPulse size={18} />CARE-AI</Link>
              <Link to="/" className="flex items-center gap-2 rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white"><ArrowLeft size={16} />Back home</Link>
            </div>
            <p className="mt-10 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Plans that grow with your care</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Useful from day one. Flexible as life changes.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-400">Start with the essentials and add shared care, deeper insight, and more storage when you need it.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-2 text-sm">
            <button type="button" onClick={() => setAnnual(false)} className={`rounded-xl px-4 py-2 ${!annual ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>Monthly</button>
            <button type="button" onClick={() => setAnnual(true)} className={`rounded-xl px-4 py-2 ${annual ? 'bg-emerald-400 font-semibold text-slate-950' : 'text-slate-400'}`}>Yearly <span className="ml-1 text-xs">Save 20%</span></button>
          </div>
        </header>

        <section className="mt-14 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = annual && plan.monthly ? Math.round(plan.monthly * 0.8) : plan.monthly;
            return (
              <article key={plan.name} className={`relative flex flex-col rounded-3xl border p-7 ${plan.featured ? 'border-emerald-400 bg-emerald-400/10' : 'border-slate-800 bg-slate-900/70'}`}>
                {plan.featured && <div className="absolute right-6 top-6 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-emerald-300"><Sparkles size={14} />Most popular</div>}
                <h2 className="text-2xl font-semibold">{plan.name}</h2>
                <p className="mt-3 min-h-14 leading-6 text-slate-400">{plan.description}</p>
                <div className="mt-7 flex items-end gap-2"><span className="text-5xl font-semibold">${price}</span><span className="mb-2 text-slate-400">/ month</span></div>
                {annual && plan.monthly > 0 && <p className="mt-2 text-sm text-emerald-300">Billed annually</p>}
                <ul className="mt-8 flex-1 space-y-4 border-t border-slate-800 pt-7">
                  {plan.features.map((feature) => <li key={feature} className="flex gap-3 text-sm text-slate-300"><Check size={18} className="shrink-0 text-emerald-300" />{feature}</li>)}
                </ul>
                <Link to="/register" className={`mt-8 rounded-2xl px-4 py-3 text-center font-semibold ${plan.featured ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300' : 'border border-slate-700 text-slate-200 hover:border-slate-500'}`}>{plan.action}</Link>
              </article>
            );
          })}
        </section>
        <p className="mt-8 text-center text-sm text-slate-500">No credit card required to start. Cancel or change your plan anytime.</p>
      </div>
    </main>
  );
}
