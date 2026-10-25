import { useEffect, useState } from 'react';
import { PageShell } from '../components/Layout';
import { request } from '../lib/api';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [doctor, setDoctor] = useState('');
  const [hospital, setHospital] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const loadAppointments = () => {
    setError('');
    request('/api/appointments/')
      .then(setAppointments)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleDeleteAppointment = async (appointmentId) => {
    setError('');
    setSuccess('');
    try {
      const result = await request(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });
      if (result.status !== 'deleted') {
        throw new Error(result.message || 'Unable to delete appointment');
      }
      setSuccess('Appointment deleted successfully.');
      setAppointments((current) => current.filter((appt) => appt.id !== appointmentId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddAppointment = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        doctor,
        hospital,
        date,
        reason,
      };
      await request('/api/appointments/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setSuccess('Appointment added successfully.');
      setDoctor('');
      setHospital('');
      setDate('');
      setReason('');
      loadAppointments();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title="Appointments" description="Track doctor visits, hospitals, and follow-ups.">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_360px]">
        <div className="space-y-6">
          {error && <div className="rounded-3xl border border-red-600 bg-red-950/50 p-4 text-red-300">{error}</div>}
          {success && <div className="rounded-3xl border border-emerald-500 bg-emerald-950/30 p-4 text-emerald-200">{success}</div>}

          {appointments.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {appointments.map((appt) => (
                <div key={appt.id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{appt.doctor}</h3>
                      <p className="mt-2 text-slate-400">Hospital: {appt.hospital}</p>
                      <p className="text-slate-400">Date: {appt.date}</p>
                      <p className="text-slate-400">Reason: {appt.reason}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteAppointment(appt.id)}
                      className="rounded-2xl border border-red-700 bg-red-700/10 px-3 py-2 text-sm text-red-300 transition hover:bg-red-700/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-400">No appointments yet. Add one to track upcoming visits.</div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h3 className="text-xl font-semibold text-white">Add appointment</h3>
          <p className="mt-2 text-slate-400">Create a new appointment for doctor visits and hospital follow-ups.</p>
          <form onSubmit={handleAddAppointment} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-200">
              Doctor name
              <input
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                placeholder="Dr. Sara"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Hospital
              <input
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                placeholder="CarePoint Medical"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Reason
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                placeholder="Routine check-up"
                required
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Add appointment'}
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
