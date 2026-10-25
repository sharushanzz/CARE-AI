import { useEffect, useState } from 'react';
import { PageShell } from '../components/Layout';
import { request } from '../lib/api';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    request('/api/admin/stats')
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <PageShell title="Admin Panel" description="Monitor users, reports, and workflows.">
      {error ? (
        <div className="rounded-3xl border border-red-600 bg-red-950/50 p-8 text-red-300">{error}</div>
      ) : stats ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="text-xl font-semibold text-white">{key}</h3>
              <p className="mt-2 text-slate-300">{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-400">Loading admin stats...</div>
      )}
    </PageShell>
  );
}
