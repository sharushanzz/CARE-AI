import { useEffect, useState } from 'react';
import { PageShell } from '../components/Layout';
import { request } from '../lib/api';

export default function EmergencyPage() {
  const [card, setCard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    request('/api/emergency/')
      .then(setCard)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <PageShell title="Emergency QR Card" description="Generate and share a critical care snapshot.">
      {error ? (
        <div className="rounded-3xl border border-red-600 bg-red-950/50 p-8 text-red-300">{error}</div>
      ) : card ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="text-xl font-semibold text-white">Emergency Contact</h3>
            <p className="mt-2 text-slate-300">{card.emergency_contact}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="text-xl font-semibold text-white">Blood Group</h3>
            <p className="mt-2 text-slate-300">{card.blood_group}</p>
            <h4 className="mt-4 text-slate-300">Allergies</h4>
            <ul className="list-disc pl-5 text-slate-300">
              {card.allergies.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-400">Loading emergency details...</div>
      )}
    </PageShell>
  );
}
