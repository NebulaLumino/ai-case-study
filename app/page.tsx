'use client';

import { useState } from 'react';

const ACCENT = 'hsl(75, 70%, 50%)';
const SYSTEM_PROMPT = `You are an expert nonprofit communications writer and ethical storytelling specialist. Generate a compelling beneficiary case study following ethical storytelling principles with appropriate privacy protections.

Include ALL of the following in clean markdown:

# BENEFICIARY CASE STUDY

## Ethical Storytelling Note
Brief statement about the ethical approach used in this case study, including consent, privacy protections, and dignity considerations.

## Case Study Overview
- Pseudonym used and rationale
- Brief demographic context (without identifying details)
- Program engaged with
- Time period of engagement
- Note on how identifying information has been protected

## Situation / Challenge
Description of the challenges the beneficiary faced BEFORE engaging with the program. Use the "3 Before" framework: What was life like before, what barriers existed, what had been tried before.

## Program Intervention
Detailed description of the program activities the beneficiary engaged with. Be specific about what happened.

## Journey / Process
Chronological narrative of the beneficiary's experience through the program, including:
- Initial engagement
- Key milestones
- Challenges faced during program
- Turning points
- Support received

## Outcomes & Impact
Specific, measurable outcomes achieved:
- Immediate outcomes (skills gained, knowledge acquired)
- Medium-term outcomes (behavior change, status change)
- Qualitative impact (quotes, reflections - can be composite or paraphrased)

## Program Features That Made a Difference
Analysis of which program elements were most impactful for this individual.

## Staff Reflection / Program Note
Brief professional note from program staff about what made this case notable.

## Lessons Learned
Key insights from this case study for program improvement.

## Replication Potential
How this success can inform program design and whether it is replicable for others.

IMPORTANT ETHICAL GUIDELINES:
- Always use pseudonyms, never real names
- Change identifying details (age, location, family composition slightly if needed)
- Get informed consent before documenting
- Tell the story WITH the person, not ABOUT them
- Focus on agency and change, not helpless victim narratives
- Never show photos without explicit consent
- Never make promises about outcomes that cannot be guaranteed
- Composite characters are acceptable when based on multiple real cases`;

export default function CaseStudyPage() {
  const [orgName, setOrgName] = useState('');
  const [program, setProgram] = useState('');
  const [outcome, setOutcome] = useState('');
  const [details, setDetails] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Organization: ${orgName}\nProgram: ${program}\nOutcome Achieved: ${outcome}\nAnonymized Beneficiary Details: ${details}\n\nGenerate an ethical beneficiary case study.`,
          systemPrompt: SYSTEM_PROMPT,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOutput(data.output);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold" style={{ background: ACCENT }}>📖</div>
          <div>
            <h1 className="font-bold text-lg">Beneficiary Case Study Generator</h1>
            <p className="text-xs text-gray-400">Ethical Storytelling with Privacy Protections</p>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Create an Ethical Case Study</h2>
          <p className="text-gray-400">Describe a program outcome and anonymized beneficiary details — get a compelling case study following ethical storytelling principles with appropriate privacy protections.</p>
        </div>
        <form onSubmit={handleGenerate} className="space-y-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Organization Name</label>
              <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="e.g. Second Chance Employment Services"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': ACCENT } as React.CSSProperties} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Program Name</label>
              <input type="text" value={program} onChange={(e) => setProgram(e.target.value)} placeholder="e.g. Transitional Jobs Program"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': ACCENT } as React.CSSProperties} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Program Outcome Achieved</label>
            <textarea value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="Describe the outcome achieved: e.g. Client successfully completed 6-month job training program and obtained full-time employment as a medical billing specialist at $18/hour with employer-provided health benefits..."
              rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 resize-none"
              style={{ '--tw-ring-color': ACCENT } as React.CSSProperties} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Anonymized Beneficiary Details — Describe the person WITHOUT identifying info</label>
            <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe the beneficiary situation WITHOUT names or identifying details: e.g. 38-year-old individual with a criminal record from 10 years ago, single parent of 2, previously unemployed for 18 months, lived in a high-poverty neighborhood, participated in the program from January-June 2026. Do NOT use real names - the AI will create a pseudonym."
              rows={5} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 resize-none"
              style={{ '--tw-ring-color': ACCENT } as React.CSSProperties} required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
            style={{ background: ACCENT }}>
            {loading ? 'Generating Case Study...' : 'Generate Case Study'}
          </button>
          {error && <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 text-red-300 text-sm">{error}</div>}
        </form>
        {output && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-white">Generated Case Study</h3>
              <button onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs px-3 py-1.5 rounded-md text-white" style={{ background: `${ACCENT}40` }}>Copy</button>
            </div>
            <div className="px-6 py-6">
              <pre className="whitespace-pre-wrap text-gray-300 text-sm font-mono leading-relaxed">{output}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
