import { useEffect, useState } from 'react';
import { PageShell } from '../components/Layout';
import { request } from '../lib/api';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    request('/api/analytics/')
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <PageShell title="Health Analytics" description="Track trends across weekly and monthly health activity.">
      {error ? (
        <div className="rounded-3xl border border-red-600 bg-red-950/50 p-8 text-red-300">{error}</div>
      ) : data ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Object.entries(data).map(([key, values]) => (
            <div key={key} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="text-xl font-semibold text-white">{key.replace('_', ' ').toUpperCase()}</h3>
              <p className="mt-3 text-slate-300">{values.join(' • ')}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-400">Loading analytics...</div>
      )}
    </PageShell>
  );
}
