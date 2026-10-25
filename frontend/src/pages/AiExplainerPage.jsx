import { useState } from 'react';
import { PageShell } from '../components/Layout';
import { request } from '../lib/api';

const SAMPLE_REPORTS = {
  pediatric: {
    label: 'Pediatric (age 8)',
    text: `Patient Name: Maya Patel
Age: 8
Report Type: Pediatric Wellness Check
Hospital: CarePoint Kids Clinic

Findings:
- Height and weight are within expected percentiles.
- Vision screening normal.
- Mild seasonal allergy symptoms reported.

Impression:
Continue regular wellness visits. Use saline nasal rinses and monitor allergy symptoms during pollen season.`,
  },
  adolescent: {
    label: 'Adolescent (age 16)',
    text: `Patient Name: Leo Brown
Age: 16
Report Type: Sports Physical
Hospital: Family Health Center

Findings:
- Heart rate and blood pressure normal.
- BMI slightly above ideal range.
- Mild knee discomfort after sports activity.

Impression:
Recommend stretching routine, weight management support, and follow-up if pain persists.`,
  },
  adult: {
    label: 'Adult (age 34)',
    text: `Patient Name: Priya Sharma
Age: 34
Report Type: Routine Blood Panel
Hospital: City Hospital

Findings:
- Hemoglobin normal.
- Cholesterol is moderately elevated.
- Vitamin D is below recommended range.

Impression:
Advise dietary changes, increased activity, and vitamin D supplementation. Recheck labs in 3 months.`,
  },
  middleAged: {
    label: 'Middle-aged (age 52)',
    text: `Patient Name: David Kim
Age: 52
Report Type: Heart Health Evaluation
Hospital: CarePoint Medical

Findings:
- Blood pressure is elevated.
- LDL cholesterol is high.
- ECG is within normal limits.

Impression:
Start lifestyle modifications and review medications. Schedule follow-up cardiac consult in 6 weeks.`,
  },
  senior: {
    label: 'Senior (age 72)',
    text: `Patient Name: Ruth Johnson
Age: 72
Report Type: Comprehensive Geriatric Assessment
Hospital: Silver Oak Medical

Findings:
- Bone density indicates early osteoporosis.
- Blood glucose elevated.
- Mobility is slightly reduced with mild joint stiffness.

Impression:
Recommend bone-strengthening exercises, dietary optimization, and fall-prevention strategies.`,
  },
};

export default function AiExplainerPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await request('/api/ai/explain', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (sampleText) => {
    setText(sampleText);
    setResult(null);
    setError('');
  };

  const handleFileChange = async (event) => {
    setError('');
    setResult(null);
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('text/') && !file.name.endsWith('.txt')) {
      setError('Please upload a text report file (.txt).');
      return;
    }

    try {
      const textContent = await file.text();
      setText(textContent);
    } catch (err) {
      setError('Unable to read the uploaded file.');
    }
  };

  return (
    <PageShell title="AI Report Explainer" description="Interpret your medical documents in plain language.">
      <div className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(SAMPLE_REPORTS).map(([key, sample]) => (
              <button
                type="button"
                key={key}
                onClick={() => handleLoadSample(sample.text)}
                className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-4 text-left text-slate-100 transition hover:border-sky-500/30 hover:bg-slate-900"
              >
                <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Sample report</div>
                <div className="mt-2 text-base font-semibold text-white">{sample.label}</div>
              </button>
            ))}
          </div>
          <label className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-200">
            Upload a .txt report
            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            />
          </label>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          className="w-full rounded-3xl border border-slate-800 bg-slate-950 p-4 text-slate-100"
          placeholder="Paste your report text here or load the sample report."
        />
        <button
          onClick={handleExplain}
          disabled={loading}
          className="rounded-3xl bg-emerald-500 px-6 py-3 font-medium text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Analyzing…' : 'Explain Report'}
        </button>
        {error && <div className="rounded-3xl border border-red-600 bg-red-950/50 p-4 text-red-300">{error}</div>}
        {result && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-slate-200">
            <h3 className="text-lg font-semibold text-white">AI Explanation</h3>
            <p className="mt-3 text-slate-300">{result.summary}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <h4 className="font-semibold text-white">Risk Level</h4>
                <p className="mt-2 text-slate-300">{result.risk_level}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <h4 className="font-semibold text-white">Health Tips</h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
                  {result.health_tips?.map((tip) => <li key={tip}>{tip}</li>)}
                </ul>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <h4 className="font-semibold text-white">Normal values</h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
                  {result.normal_values?.map((value) => <li key={value}>{value}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <h4 className="font-semibold text-white">Abnormal values</h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
                  {result.abnormal_values?.map((value) => <li key={value}>{value}</li>)}
                </ul>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <h4 className="font-semibold text-white">Questions to ask your doctor</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
                {result.questions_to_ask_doctor?.map((question) => <li key={question}>{question}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
