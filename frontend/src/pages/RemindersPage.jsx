import { useEffect, useState } from 'react';
import { PageShell } from '../components/Layout';
import { request } from '../lib/api';

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    request('/api/reminders/')
      .then(setReminders)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <PageShell title="Medicine Reminder" description="Create medication reminders with status tracking.">
      {error ? (
        <div className="rounded-3xl border border-red-600 bg-red-950/50 p-8 text-red-300">{error}</div>
      ) : reminders.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="text-xl font-semibold text-white">{reminder.name}</h3>
              <p className="mt-2 text-slate-400">Time: {reminder.time}</p>
              <p className="text-slate-400">Status: {reminder.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-400">Loading reminders...</div>
      )}
    </PageShell>
  );
}
