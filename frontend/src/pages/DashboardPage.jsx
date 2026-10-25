import { useEffect, useState } from 'react';
import { FileText, CalendarDays, HeartPulse, Building2, Sparkles, ArrowDownRight, Users, RefreshCcw } from 'lucide-react';
import { PageShell } from '../components/Layout';
import { request } from '../lib/api';

const accentClasses = {
  emerald: 'bg-emerald-500/15 text-emerald-400',
  sky: 'bg-sky-500/15 text-sky-400',
  violet: 'bg-violet-500/15 text-violet-400',
  amber: 'bg-amber-500/15 text-amber-400',
  rose: 'bg-rose-500/15 text-rose-400',
};

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadSummary = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await request('/api/reports/summary');
      setSummary(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
    const interval = setInterval(loadSummary, 20000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <PageShell title="Dashboard" description="Your health hub at a glance.">
        <div className="rounded-3xl border border-red-600 bg-red-950/50 p-8 text-red-300">{error}</div>
      </PageShell>
    );
  }

  if (!summary) {
    return (
      <PageShell title="Dashboard" description="Your health hub at a glance.">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-10 text-slate-400">Loading dashboard…</div>
      </PageShell>
    );
  }

  const cards = [
    { title: 'Health Score', value: `${summary.healthScore}/100`, icon: HeartPulse, accent: 'emerald' },
    { title: 'Reports Uploaded', value: `${summary.reportsUploaded} files`, icon: FileText, accent: 'sky' },
    { title: 'Upcoming Appointments', value: `${summary.upcomingAppointments} this week`, icon: CalendarDays, accent: 'violet' },
    { title: 'Family Connections', value: `${summary.familyConnections} members`, icon: Users, accent: 'amber' },
    { title: 'Hospital Visits', value: `${summary.hospitalVisits} this month`, icon: Building2, accent: 'rose' },
  ];

  return (
    <PageShell title="Dashboard" description="Your health hub at a glance.">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-slate-400">Last updated: {lastUpdated ?? 'Loading...'}</p>
        </div>
        <button
          type="button"
          onClick={loadSummary}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcw size={16} />
          {loading ? 'Refreshing...' : 'Refresh dashboard'}
        </button>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/20 transition duration-300 hover:-translate-y-1 hover:border-emerald-500/40"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-2xl p-3 ${accentClasses[card.accent]}`}>
                <card.icon size={22} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p className="text-sm text-slate-400">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Care priorities</h3>
              <p className="text-sm text-slate-500">Recommended next steps for your family care plan.</p>
            </div>
            <Sparkles className="text-emerald-400" size={20} />
          </div>
          <div className="space-y-4">
            {summary.recommendedCare.map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-800 bg-slate-950/50 p-4 transition duration-300 hover:bg-slate-900/90">
                <p className="font-medium text-white">{item.label}</p>
                <p className="text-sm text-slate-400">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Recent reports</h3>
              <p className="text-sm text-slate-500">Latest hospital summaries and lab results.</p>
            </div>
            <ArrowDownRight className="text-sky-400" size={20} />
          </div>
          <div className="space-y-4">
            {summary.recentReports.map((report) => (
              <div key={report.id} className="rounded-3xl border border-slate-800 bg-slate-950/50 p-4 transition duration-300 hover:border-sky-500/40 hover:bg-slate-900/80">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white">{report.title}</p>
                    <p className="text-sm text-slate-400">{report.type} · {report.hospital}</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">{report.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
