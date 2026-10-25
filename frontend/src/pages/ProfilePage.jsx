import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { PageShell } from '../components/Layout';
import { request, requestForm } from '../lib/api';
import {
  Camera,
  CheckCircle2,
  Edit3,
  Save,
  X,
  RefreshCcw,
  User,
  Mail,
  Phone,
  MapPin,
  HeartPulse,
  ShieldCheck,
  Bell,
  FileText,
  UploadCloud,
  Trash2,
  Globe,
  CalendarDays,
  Lock,
  Info,
  Download,
  Eye,
} from 'lucide-react';

const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const languageOptions = ['English', 'Tamil', 'Hindi', 'Telugu', 'Kannada', 'Malayalam'];
const themeOptions = ['Light', 'Dark', 'System'];
const notificationFields = [
  { name: 'medicine_reminders', label: 'Medicine Reminders' },
  { name: 'appointment_reminders', label: 'Appointment Reminders' },
  { name: 'health_alerts', label: 'Health Alerts' },
  { name: 'email_notifications', label: 'Email Notifications' },
];
const allowedPhotoTypes = ['image/jpeg', 'image/png', 'image/webp'];
const allowedDocumentTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
const maxPhotoSize = 5 * 1024 * 1024;

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [documentError, setDocumentError] = useState('');
  const documentInputRef = useRef(null);

  const { register, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: 'Prefer not to say',
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      blood_group: 'Unknown',
      allergies: '',
      medical_conditions: '',
      current_medications: '',
      health_notes: '',
      emergency_contact_name: '',
      emergency_contact_relationship: '',
      emergency_contact_phone: '',
      alternative_contact: '',
      preferred_language: 'English',
      timezone: 'UTC',
      theme: 'System',
      notification_preferences: {
        medicine_reminders: true,
        appointment_reminders: true,
        health_alerts: true,
        email_notifications: true,
      },
    },
  });

  const watchNotificationPreferences = watch('notification_preferences', {});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setError('');
    try {
      const data = await request('/api/profile');
      setProfile(data);
      reset({
        ...data,
        notification_preferences: {
          medicine_reminders: data.notification_preferences?.medicine_reminders ?? true,
          appointment_reminders: data.notification_preferences?.appointment_reminders ?? true,
          health_alerts: data.notification_preferences?.health_alerts ?? true,
          email_notifications: data.notification_preferences?.email_notifications ?? true,
        },
      });
      setPhotoPreview(data.profile_photo || '');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditOpen = () => {
    setEditing(true);
    setMessage('');
  };

  const handleCancel = () => {
    if (profile) {
      reset({
        ...profile,
        notification_preferences: {
          medicine_reminders: profile.notification_preferences?.medicine_reminders ?? true,
          appointment_reminders: profile.notification_preferences?.appointment_reminders ?? true,
          health_alerts: profile.notification_preferences?.health_alerts ?? true,
          email_notifications: profile.notification_preferences?.email_notifications ?? true,
        },
      });
      setPhotoPreview(profile.profile_photo || '');
      setPhotoFile(null);
    }
    setEditing(false);
    setError('');
    setMessage('');
  };

  const handleReset = () => {
    handleCancel();
  };

  const handlePhotoChange = (file) => {
    if (!file) {
      return;
    }
    if (!allowedPhotoTypes.includes(file.type)) {
      setError('Only JPG, PNG, and WEBP images are allowed.');
      return;
    }
    if (file.size > maxPhotoSize) {
      setError('Profile photo must be 5 MB or smaller.');
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError('');
  };

  const handlePhotoUploadDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handlePhotoChange(file);
    }
  };

  const uploadProfilePhoto = async () => {
    if (!photoFile) {
      return null;
    }
    const formData = new FormData();
    formData.append('photo', photoFile);
    const data = await requestForm('/api/profile/photo', formData);
    return data.profile_photo;
  };

  const onSubmit = async (values) => {
    setError('');
    setMessage('');
    setSaving(true);
    try {
      if (photoFile) {
        const photoUrl = await uploadProfilePhoto();
        values.profile_photo = photoUrl;
      }
      const updated = await request('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(values),
      });
      setProfile(updated);
      reset({
        ...updated,
        notification_preferences: {
          medicine_reminders: updated.notification_preferences?.medicine_reminders ?? true,
          appointment_reminders: updated.notification_preferences?.appointment_reminders ?? true,
          health_alerts: updated.notification_preferences?.health_alerts ?? true,
          email_notifications: updated.notification_preferences?.email_notifications ?? true,
        },
      });
      setPhotoPreview(updated.profile_photo || '');
      setPhotoFile(null);
      setMessage('Profile updated successfully.');
      setEditing(false);
      localStorage.setItem('user', JSON.stringify(updated));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordMessage('');
    const form = new FormData(event.target);
    const current_password = form.get('current_password');
    const new_password = form.get('new_password');
    const confirm_password = form.get('confirm_password');
    if (!current_password || !new_password || !confirm_password) {
      setPasswordError('All password fields are required.');
      return;
    }
    if (new_password !== confirm_password) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (new_password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }
    try {
      await request('/api/profile/password', {
        method: 'PUT',
        body: JSON.stringify({ current_password, new_password, confirm_password }),
      });
      setPasswordMessage('Password updated successfully.');
      event.target.reset();
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  const handleDocumentSelect = async (file) => {
    if (!file) {
      return;
    }
    if (!allowedDocumentTypes.includes(file.type)) {
      setDocumentError('Only PDF, JPG, PNG and WEBP documents are allowed.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setDocumentError('Document must be 20 MB or smaller.');
      return;
    }
    setDocumentError('');
    setUploadingDoc(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      const document = await requestForm('/api/profile/documents', formData);
      setProfile((current) => ({
        ...current,
        documents: [document, ...(current?.documents || [])],
      }));
      setMessage('Document uploaded successfully.');
    } catch (err) {
      setDocumentError(err.message);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDocumentDelete = async (documentId) => {
    setDocumentsLoading(true);
    setDocumentError('');
    try {
      await request(`/api/profile/documents/${documentId}`, { method: 'DELETE' });
      setProfile((current) => ({
        ...current,
        documents: (current?.documents || []).filter((doc) => doc.id !== documentId),
      }));
      setMessage('Document deleted successfully.');
    } catch (err) {
      setDocumentError(err.message);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const profilePhotoUrl = useMemo(() => profile?.profile_photo || photoPreview || '/default-avatar.png', [profile, photoPreview]);

  if (error) {
    return (
      <PageShell title="Profile" description="Manage your personal and care preferences.">
        <div className="rounded-3xl border border-red-600 bg-red-950/50 p-8 text-red-300">{error}</div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Profile" description="Manage your personal and care preferences.">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Your profile</h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              Update your health profile, emergency contacts, preferences, and document uploads in one secure place.
            </p>
          </div>
          <button
            onClick={handleEditOpen}
            className="inline-flex items-center gap-2 rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:bg-cyan-400"
          >
            <Edit3 size={18} /> Edit Profile
          </button>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-emerald-200"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span>{message}</span>
            </div>
          </motion.div>
        )}

        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
            <div className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-slate-950/70 p-6 text-center backdrop-blur-xl">
              <div className="mx-auto mb-5 h-40 w-40 overflow-hidden rounded-3xl border border-slate-700 bg-slate-900">
                <img src={profilePhotoUrl} alt="Profile" className="h-full w-full object-cover" />
              </div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Profile</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{profile?.name || 'Loading...'}</h2>
              <p className="mt-2 text-slate-400">{profile?.email}</p>
              <button
                onClick={handleEditOpen}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
              >
                <Camera size={16} /> Edit Profile
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-950/80 p-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <User size={18} />
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Account created</p>
                    <p className="mt-1 text-sm text-slate-300">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <CalendarDays size={18} />
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Last updated</p>
                    <p className="mt-1 text-sm text-slate-300">{profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/10">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                    <p className="mt-1 text-slate-400">Core profile details used to personalize your CARE-AI experience.</p>
                  </div>
                  <HeartPulse size={22} className="text-cyan-400" />
                </div>
                <div className="mt-6 space-y-3 text-slate-300">
                  <div>
                    <p className="text-sm text-slate-500">Full Name</p>
                    <p>{profile?.name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Date of Birth</p>
                    <p>{profile?.date_of_birth || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Gender</p>
                    <p>{profile?.gender || 'Prefer not to say'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/10">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                    <p className="mt-1 text-slate-400">Your address and phone details for notifications and reminders.</p>
                  </div>
                  <Mail size={22} className="text-cyan-400" />
                </div>
                <div className="mt-6 space-y-3 text-slate-300">
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p>{profile?.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p>{profile?.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Address</p>
                    <p>{profile?.address || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">City / State / Postal</p>
                    <p>{`${profile?.city || '—'} / ${profile?.state || '—'} / ${profile?.postal_code || '—'}`}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/10">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Health Information</h3>
                    <p className="mt-1 text-slate-400">Health data used to personalize care insights and alerts.</p>
                  </div>
                  <ShieldCheck size={22} className="text-cyan-400" />
                </div>
                <div className="mt-6 space-y-3 text-slate-300">
                  <div>
                    <p className="text-sm text-slate-500">Blood Group</p>
                    <p>{profile?.blood_group || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Allergies</p>
                    <p>{profile?.allergies || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Medical Conditions</p>
                    <p>{profile?.medical_conditions || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Current Medications</p>
                    <p>{profile?.current_medications || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/10">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Emergency & Preferences</h3>
                    <p className="mt-1 text-slate-400">Emergency contacts, language, timezone, and notification settings.</p>
                  </div>
                  <Bell size={22} className="text-cyan-400" />
                </div>
                <div className="mt-6 space-y-3 text-slate-300">
                  <div>
                    <p className="text-sm text-slate-500">Emergency Contact</p>
                    <p>{profile?.emergency_contact_name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Relationship</p>
                    <p>{profile?.emergency_contact_relationship || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Emergency Phone</p>
                    <p>{profile?.emergency_contact_phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Language / Timezone</p>
                    <p>{`${profile?.preferred_language || 'English'} / ${profile?.timezone || 'UTC'}`}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Uploaded Medical Documents</h3>
              <p className="mt-1 text-slate-400">Store and review your key healthcare documents securely.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => documentInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                <UploadCloud size={18} /> Upload New
              </button>
              <button
                type="button"
                onClick={() => setMessage('You can drop a document during edit or upload directly.')}
                className="inline-flex items-center gap-2 rounded-3xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm text-slate-300 transition hover:border-cyan-500"
              >
                <Info size={18} /> Learn More
              </button>
            </div>
          </div>

          <input
            ref={documentInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={(event) => handleDocumentSelect(event.target.files?.[0])}
          />

          {documentError && <div className="mt-4 rounded-3xl border border-red-600 bg-red-950/50 p-4 text-red-300">{documentError}</div>}

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-slate-300">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400">
                  <th className="border-b border-slate-800 px-4 py-3">Document</th>
                  <th className="border-b border-slate-800 px-4 py-3">Type</th>
                  <th className="border-b border-slate-800 px-4 py-3">Uploaded</th>
                  <th className="border-b border-slate-800 px-4 py-3">Status</th>
                  <th className="border-b border-slate-800 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(profile?.documents || []).length ? (
                  profile.documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-slate-800">
                      <td className="px-4 py-4 text-white">{doc.name}</td>
                      <td className="px-4 py-4">{doc.type.split('/')[1].toUpperCase()}</td>
                      <td className="px-4 py-4">{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                      <td className="px-4 py-4 text-emerald-300">{doc.status}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <a href={doc.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 transition hover:border-cyan-500">
                            <Eye size={14} /> View
                          </a>
                          <a href={doc.url} download className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 transition hover:border-cyan-500">
                            <Download size={14} /> Download
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDocumentDelete(doc.id)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-red-600 bg-red-600/10 px-3 py-2 text-xs text-red-300 transition hover:bg-red-600/20"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                      No uploaded documents yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-white">Change Password</h3>
              <p className="mt-1 text-slate-400">Update your password with strong authentication rules.</p>
            </div>
            <Lock size={22} className="text-cyan-400" />
          </div>
          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <label className="block">
                <span className="text-sm text-slate-400">Current Password</span>
                <input name="current_password" type="password" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
              </label>
              <label className="block">
                <span className="text-sm text-slate-400">New Password</span>
                <input name="new_password" type="password" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
              </label>
              <label className="block">
                <span className="text-sm text-slate-400">Confirm New Password</span>
                <input name="confirm_password" type="password" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
              </label>
            </div>
            {passwordError && <div className="rounded-3xl border border-red-600 bg-red-950/50 p-4 text-red-300">{passwordError}</div>}
            {passwordMessage && <div className="rounded-3xl border border-emerald-500 bg-emerald-500/10 p-4 text-emerald-200">{passwordMessage}</div>}
            <button type="submit" className="inline-flex items-center gap-2 rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
              <Save size={18} /> Save Password
            </button>
          </form>
        </section>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-6xl max-h-[calc(100vh-4rem)] overflow-y-auto rounded-[40px] border border-slate-800 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/40"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold text-white">Edit Profile</h2>
                  <p className="mt-2 text-slate-400">
                    Use this form to keep your health profile up to date. All changes persist securely in your CARE-AI account.
                  </p>
                </div>
                <button onClick={handleCancel} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:border-emerald-500">
                  <X size={16} /> Close
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
                <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                    <div className="relative overflow-hidden rounded-[30px] border border-slate-700 bg-slate-950/90 p-6 text-center">
                      <div
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={handlePhotoUploadDrop}
                        className="group mx-auto mb-4 flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 transition hover:border-cyan-500"
                      >
                        {photoPreview ? (
                          <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-slate-400 transition group-hover:text-cyan-300">
                            <Camera size={32} />
                            <span className="text-sm">Drag & drop</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        id="profile-photo"
                        onChange={(event) => handlePhotoChange(event.target.files?.[0])}
                      />
                      <label htmlFor="profile-photo" className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-700 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200 transition hover:border-cyan-400">
                        <UploadCloud size={16} /> Change Photo
                      </label>
                      {photoPreview && (
                        <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(profile?.profile_photo || ''); }} className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 transition hover:border-red-500">
                          <Trash2 size={16} /> Remove Photo
                        </button>
                      )}
                      <p className="mt-4 text-sm text-slate-500">Accepted JPG, PNG, WEBP. Max 5 MB.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <label className="block">
                        <span className="text-sm text-slate-400">Full Name</span>
                        <input
                          type="text"
                          {...register('name', { required: 'Full name is required' })}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
                        />
                        {errors.name && <p className="mt-2 text-sm text-rose-400">{errors.name.message}</p>}
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-400">Email</span>
                        <input
                          type="email"
                          {...register('email', { required: 'Email is required' })}
                          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
                        />
                        {errors.email && <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p>}
                      </label>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <label className="block">
                        <span className="text-sm text-slate-400">Date of Birth</span>
                        <input type="date" {...register('date_of_birth')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-400">Gender</span>
                        <select {...register('gender')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100">
                          {genderOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <label className="block">
                        <span className="text-sm text-slate-400">Phone Number</span>
                        <input type="tel" {...register('phone')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
                      </label>
                      <label className="block">
                        <span className="text-sm text-slate-400">Preferred Language</span>
                        <select {...register('preferred_language')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100">
                          {languageOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/10">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Contact Information</h3>
                      <p className="mt-1 text-slate-400">Update your address and postal details.</p>
                    </div>
                    <MapPin size={22} className="text-cyan-400" />
                  </div>
                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <label className="block">
                      <span className="text-sm text-slate-400">Country</span>
                      <input type="text" {...register('country')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-400">State</span>
                      <input type="text" {...register('state')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-400">City</span>
                      <input type="text" {...register('city')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-400">Postal Code</span>
                      <input type="text" {...register('postal_code')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
                    </label>
                    <label className="lg:col-span-2 block">
                      <span className="text-sm text-slate-400">Home Address</span>
                      <input type="text" {...register('address')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
                    </label>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/10">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Health Information</h3>
                      <p className="mt-1 text-slate-400">This information helps CARE-AI tailor your recommendations.</p>
                    </div>
                    <HeartPulse size={22} className="text-cyan-400" />
                  </div>
                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <label className="block">
                      <span className="text-sm text-slate-400">Blood Group</span>
                      <select {...register('blood_group')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100">
                        {bloodGroups.map((group) => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-400">Allergies</span>
                      <input type="text" {...register('allergies')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-400">Medical Conditions</span>
                      <input type="text" {...register('medical_conditions')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-400">Current Medications</span>
                      <input type="text" {...register('current_medications')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
                    </label>
                    <label className="lg:col-span-2 block">
                      <span className="text-sm text-slate-400">Additional Health Notes</span>
                      <textarea rows="3" {...register('health_notes')} className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
                    </label>
                  </div>
                  <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-400">
                    Please ensure your health information is accurate. CARE-AI uses this information to personalize your healthcare management experience. It does not replace professional medical advice.
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/10">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Emergency Information</h3>
                      <p className="mt-1 text-slate-400">Who should CARE-AI contact when urgent care is needed?</p>
                    </div>
                    <ShieldCheck size={22} className="text-cyan-400" />
                  </div>
                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <label className="block">
                      <span className="text-sm text-slate-400">Emergency Contact Name</span>
                      <input type="text" {...register('emergency_contact_name')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-400">Relationship</span>
                      <input type="text" {...register('emergency_contact_relationship')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-400">Emergency Contact Phone</span>
                      <input type="tel" {...register('emergency_contact_phone')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-400">Alternative Contact</span>
                      <input type="text" {...register('alternative_contact')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
                    </label>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/10">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Preferences</h3>
                      <p className="mt-1 text-slate-400">Customize your language, theme, and notifications.</p>
                    </div>
                    <Globe size={22} className="text-cyan-400" />
                  </div>
                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <label className="block">
                      <span className="text-sm text-slate-400">Timezone</span>
                      <input type="text" {...register('timezone')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-400">Theme</span>
                      <select {...register('theme')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100">
                        {themeOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="mt-6 grid gap-3">
                    {notificationFields.map((field) => (
                      <label key={field.name} className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-4">
                        <input type="checkbox" {...register(`notification_preferences.${field.name}`)} className="h-5 w-5 rounded-md border-slate-700 bg-slate-950 text-cyan-500" />
                        <div>
                          <p className="font-medium text-white">{field.label}</p>
                          <p className="text-sm text-slate-500">Receive updates for this category.</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {error && <div className="rounded-3xl border border-red-600 bg-red-950/50 p-4 text-red-300">{error}</div>}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <button type="button" onClick={handleReset} className="rounded-3xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm text-slate-200 transition hover:border-cyan-500">
                    <RefreshCcw size={16} /> Reset
                  </button>
                  <button type="button" onClick={handleCancel} className="rounded-3xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm text-slate-200 transition hover:border-cyan-500">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
