import { useEffect, useState } from 'react';
import { PageShell } from '../components/Layout';
import { request } from '../lib/api';

export default function FamilyPage() {
  const [family, setFamily] = useState([]);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [loading, setLoading] = useState(false);

  const loadFamily = () => {
    setError('');
    request('/api/family/')
      .then(setFamily)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadFamily();
  }, []);

  const handleDeleteMember = async (memberId) => {
    setError('');
    try {
      const result = await request(`/api/family/${memberId}`, {
        method: 'DELETE',
      });
      if (result.status !== 'deleted') {
        throw new Error(result.message || 'Unable to delete member');
      }
      setFamily((current) => current.filter((member) => member.id !== memberId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddMember = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { name, relation, blood_group: bloodGroup };
      const newMember = await request('/api/family/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setFamily((current) => [...current, newMember]);
      setName('');
      setRelation('');
      setBloodGroup('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title="Family Management" description="Add, edit, and organize loved ones.">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="text-xl font-semibold text-white">Family overview</h3>
            <p className="mt-2 text-slate-400">You currently have <span className="font-semibold text-white">{family.length}</span> member{family.length === 1 ? '' : 's'} in your family circle.</p>
          </div>

          {error && <div className="rounded-3xl border border-red-600 bg-red-950/50 p-4 text-red-300">{error}</div>}

          {family.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {family.map((member) => (
                <div key={member.id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                      <p className="mt-2 text-slate-400">Relation: {member.relation}</p>
                      <p className="text-slate-400">Blood group: {member.blood_group}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteMember(member.id)}
                      className="rounded-2xl border border-red-700 bg-red-700/10 px-3 py-2 text-sm text-red-300 transition hover:bg-red-700/20"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-400">No family members available yet. Add members to get started.</div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h3 className="text-xl font-semibold text-white">Add family member</h3>
          <p className="mt-2 text-slate-400">Add a loved one to your household care plan.</p>
          <form onSubmit={handleAddMember} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-200">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                placeholder="Full name"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Relation
              <input
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                placeholder="Daughter, Husband, Parent"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Blood group
              <input
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                placeholder="O+, A-, B+, AB+"
                required
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Adding member…' : 'Add member'}
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
