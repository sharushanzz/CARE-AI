import { useEffect, useState } from 'react';
import { PageShell } from '../components/Layout';
import { request } from '../lib/api';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    request('/api/settings/')
      .then(setSettings)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <PageShell title="Settings" description="Update notifications and security preferences.">
      {error ? (
        <div className="rounded-3xl border border-red-600 bg-red-950/50 p-8 text-red-300">{error}</div>
      ) : settings ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 space-y-3 text-slate-300">
          <div>Dark mode: {settings.dark_mode ? 'On' : 'Off'}</div>
          <div>Notifications: {settings.notifications ? 'Enabled' : 'Disabled'}</div>
          <div>Language: {settings.language}</div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-400">Loading settings...</div>
      )}
    </PageShell>
  );
}
