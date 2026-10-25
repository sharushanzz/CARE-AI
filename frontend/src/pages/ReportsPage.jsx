import { useEffect, useState } from 'react';
import { Download, FileText, Building2, UploadCloud, Trash2, RefreshCcw } from 'lucide-react';
import { PageShell } from '../components/Layout';
import { request, downloadFile } from '../lib/api';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [hospital, setHospital] = useState('');
  const [uploading, setUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const loadReports = () => {
    setError('');
    request('/api/reports/')
      .then(setReports)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!selectedFile) {
      setError('Please choose a report file to upload.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('hospital', hospital || 'Primary Care Center');
      const response = await fetch('/api/reports/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.detail || body.message || 'Upload failed');
      }
      await response.json();
      setSuccess('Report uploaded successfully.');
      setSelectedFile(null);
      setHospital('');
      loadReports();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (reportId) => {
    try {
      setDownloadingId(reportId);
      await downloadFile(`/api/reports/${reportId}/download`);
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloadingId('');
    }
  };

  const handleDeleteReport = async (reportId) => {
    setError('');
    setSuccess('');
    setDeletingId(reportId);
    try {
      const result = await request(`/api/reports/${reportId}`, { method: 'DELETE' });
      if (result.status !== 'deleted') {
        throw new Error(result.message || 'Unable to delete report');
      }
      setReports((current) => current.filter((report) => report.id !== reportId));
      setSuccess('Report deleted successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId('');
    }
  };

  return (
    <PageShell title="Medical Reports" description="Upload, preview, download, and organize reports.">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_360px]">
        <div className="space-y-6">
          {error && <div className="rounded-3xl border border-red-600 bg-red-950/50 p-4 text-red-300">{error}</div>}
          {success && <div className="rounded-3xl border border-emerald-500 bg-emerald-950/30 p-4 text-emerald-200">{success}</div>}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-cyan-400" />
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Reports available</p>
                  <p className="text-3xl font-semibold text-white">{reports.length}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={loadReports}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-600 hover:text-white"
              >
                <RefreshCcw size={16} />
                Refresh
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-4 flex items-center gap-3">
              <UploadCloud size={20} className="text-emerald-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Upload new report</h3>
                <p className="text-sm text-slate-400">Upload files and attach hospital information.</p>
              </div>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <label className="block text-sm font-medium text-slate-200">
                Report file
                <input
                  type="file"
                  accept=".pdf,.txt,.png,.jpg,.jpeg"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
                />
              </label>
              <label className="block text-sm font-medium text-slate-200">
                Hospital name
                <input
                  value={hospital}
                  onChange={(event) => setHospital(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                  placeholder="CarePoint Medical"
                />
              </label>
              <button
                type="submit"
                disabled={uploading}
                className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? 'Uploading…' : 'Upload report'}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex items-center gap-3">
              <Building2 size={20} className="text-emerald-400" />
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Hospital partners</p>
                <p className="text-3xl font-semibold text-white">{new Set(reports.map((report) => report.hospital || 'Care Center')).size}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-500/30">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{report.title}</h3>
                  <p className="mt-2 text-slate-400">{report.type} · {report.hospital || 'Care Center'}</p>
                  <p className="text-sm text-slate-500">Status: <span className="font-medium text-white">{report.status}</span></p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(report.id)}
                    disabled={downloadingId === report.id || deletingId === report.id}
                    className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Download size={16} />
                    {downloadingId === report.id ? 'Downloading...' : 'Download'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteReport(report.id)}
                    disabled={downloadingId === report.id || deletingId === report.id}
                    className="inline-flex items-center gap-2 rounded-2xl border border-red-700 bg-red-700/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-700/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={16} />
                    {deletingId === report.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
