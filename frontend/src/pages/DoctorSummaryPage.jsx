import { useState } from 'react';
import { PageShell } from '../components/Layout';
import { request } from '../lib/api';

export default function DoctorSummaryPage() {
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    setError('');
    try {
      const data = await request('/api/doctors/summary', {
        method: 'POST',
        body: JSON.stringify({ notes }),
      });
      setSummary(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <PageShell title="Doctor Summary" description="Create concise summaries for visits and follow-ups.">
      <div className="space-y-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          className="w-full rounded-3xl border border-slate-800 bg-slate-950 p-4 text-slate-100"
          placeholder="Enter doctor visit notes or findings here..."
        />
        <button onClick={handleSummarize} className="rounded-3xl bg-emerald-500 px-6 py-3 font-medium text-white">Get Summary</button>
        {error && <div className="rounded-3xl border border-red-600 bg-red-950/50 p-4 text-red-300">{error}</div>}
        {summary && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-slate-200">
            <h3 className="text-lg font-semibold text-white">Summary</h3>
            <p className="mt-3 text-slate-300">{summary.summary}</p>
            <h4 className="mt-4 font-semibold text-white">Action Items</h4>
            <p className="mt-2 text-slate-300">{summary.action_items}</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
