import { useState } from 'react';
import { PageShell } from '../components/Layout';
import { request } from '../lib/api';

export default function ChatbotPage() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');

  const handleSend = async () => {
    setError('');
    try {
      const data = await request('/api/chatbot/', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
      setReply(data.reply);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <PageShell title="AI Chatbot" description="Ask about symptoms, wellness, reports, and more.">
      <div className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full rounded-3xl border border-slate-800 bg-slate-950 p-4 text-slate-100"
          placeholder="Type your healthcare question or symptom here..."
        />
        <button onClick={handleSend} className="rounded-3xl bg-emerald-500 px-6 py-3 font-medium text-white">Send Message</button>
        {error && <div className="rounded-3xl border border-red-600 bg-red-950/50 p-4 text-red-300">{error}</div>}
        {reply && <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-slate-200">{reply}</div>}
      </div>
    </PageShell>
  );
}
