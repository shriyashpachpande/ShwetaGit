import React from 'react';

// small helpers
const V = (v, d='-') => (v === 0 || v ? v : d);

export function CbcCard({ p }) {
  if (!p) return null;
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>WBC: {V(p.wbc?.value)} {V(p.wbc?.unit)}</div>
        <div>Neut%: {V(p.neutrophils?.percent)}</div>
        <div>Lymph%: {V(p.lymphocytes?.percent)}</div>
        <div>Hb: {V(p.hemoglobin?.value)} {V(p.hemoglobin?.unit)}</div>
        <div>Hct: {V(p.hematocrit?.value)} {V(p.hematocrit?.unit)}</div>
        <div>Platelets: {V(p.platelets?.value)} {V(p.platelets?.unit)}</div>
        <div>MCV: {V(p.indices?.mcv)}</div>
        <div>MCHC: {V(p.indices?.mchc)}</div>
      </div>
      {p.anc?.value && (
        <div className="mt-1">
          ANC: {p.anc.value} {p.anc.unit} ({p.anc.risk})
        </div>
      )}
      {Array.isArray(p.flags) && p.flags.length > 0 && (
        <div className="mt-1">
          Flags: {p.flags.join(', ')}
        </div>
      )}
    </div>
  );
}

export function LabPanelTable({ payload }) {
  if (!payload) return null;
  const rows = payload.analytes || [];
  return (
    <div className="space-y-2">
      <div className="font-semibold">{payload.panelName || 'Lab Panel'}</div>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-1 pr-2">Test</th>
              <th className="py-1 pr-2">Value</th>
              <th className="py-1 pr-2">Unit</th>
              <th className="py-1 pr-2">Ref</th>
              <th className="py-1 pr-2">Flag</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a, i) => (
              <tr key={i} className="border-t">
                <td className="py-1 pr-2">{V(a.name)}</td>
                <td className="py-1 pr-2">{V(a.value)}</td>
                <td className="py-1 pr-2">{V(a.unit)}</td>
                <td className="py-1 pr-2">{V(a.refRange)}</td>
                <td className="py-1 pr-2">{V(a.flag)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {payload.interpretation && (
        <div className="text-justify">{payload.interpretation}</div>
      )}
    </div>
  );
}

export function ImagingCard({ p }) {
  if (!p) return null;
  return (
    <div className="space-y-2">
      <div>Modality: {V(p.modality)}</div>
      <div>Body Part: {V(p.bodyPart)}</div>
      {p.technique && <div>Technique: {p.technique}</div>}
      <div>
        Findings:
        <ul className="list-disc ml-5">
          {(p.findings || []).map((f, i) => <li key={i}>{f}</li>)}
        </ul>
      </div>
      <div>Impression: {V(p.impression)}</div>
      {(p.recommendations || []).length > 0 && (
        <div>
          Recommendations:
          <ul className="list-disc ml-5">
            {p.recommendations.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export function PathologyCard({ p }) {
  if (!p) return null;
  return (
    <div className="space-y-2">
      <div>Specimen: {V(p.specimen)}</div>
      {p.gross && <div>Gross: {p.gross}</div>}
      <div>Microscopy: {V(p.microscopy)}</div>
      <div>Diagnosis: {V(p.diagnosis)}</div>
      {(p.ihc || []).length > 0 && (
        <div>IHC: {(p.ihc || []).join(', ')}</div>
      )}
    </div>
  );
}

export function DischargeCard({ p }) {
  if (!p) return null;
  return (
    <div className="space-y-2">
      <div>Diagnoses:
        <ul className="list-disc ml-5">{(p.diagnoses || []).map((d,i)=><li key={i}>{d}</li>)}</ul>
      </div>
      {(p.procedures || []).length > 0 && (
        <div>Procedures:
          <ul className="list-disc ml-5">{p.procedures.map((d,i)=><li key={i}>{d}</li>)}</ul>
        </div>
      )}
      {(p.meds || []).length > 0 && (
        <div>Medications:
          <ul className="list-disc ml-5">{p.meds.map((m,i)=><li key={i}>{m}</li>)}</ul>
        </div>
      )}
      <div>Hospital Course: {V(p.hospitalCourse)}</div>
      {(p.followUp || []).length > 0 && (
        <div>Follow-up:
          <ul className="list-disc ml-5">{p.followUp.map((f,i)=><li key={i}>{f}</li>)}</ul>
        </div>
      )}
    </div>
  );
}

export function PrescriptionCard({ p }) {
  if (!p) return null;
  const meds = p.medications || [];
  return (
    <div className="space-y-2">
      <div className="font-semibold">Medications</div>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-1 pr-2">Drug</th>
              <th className="py-1 pr-2">Dose</th>
              <th className="py-1 pr-2">Frequency</th>
              <th className="py-1 pr-2">Duration</th>
              <th className="py-1 pr-2">Instructions</th>
            </tr>
          </thead>
          <tbody>
            {meds.map((m, i) => (
              <tr key={i} className="border-t">
                <td className="py-1 pr-2">{V(m.drug)}</td>
                <td className="py-1 pr-2">{V(m.dose)}</td>
                <td className="py-1 pr-2">{V(m.frequency)}</td>
                <td className="py-1 pr-2">{V(m.duration)}</td>
                <td className="py-1 pr-2">{V(m.instructions)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OperativeCard({ p }) {
  if (!p) return null;
  return (
    <div className="space-y-2">
      {p.surgeon && <div>Surgeon: {p.surgeon}</div>}
      {(p.assistants || []).length > 0 && (
        <div>Assistants: {p.assistants.join(', ')}</div>
      )}
      <div>Pre‑op: {V(p.preOp)}</div>
      <div>Post‑op: {V(p.postOp)}</div>
      <div>Procedure: {V(p.procedure)}</div>
      <div>Findings: {V(p.findings)}</div>
      {p.complications && <div>Complications: {p.complications}</div>}
    </div>
  );
}

export default function EnvelopeRenderer({ envelope }) {
  if (!envelope) return null;
  const type = envelope.reportType;
  const p = envelope.payload;

  return (
    <div className="mt-4 divide-y divide-gray-300">
      <div className="py-2"><b>Type:</b> {type}</div>
      <div className="py-2 text-justify"><b>Summary:</b> {envelope.summary || '-'}</div>

      {type === 'cbc' && <div className="py-2"><CbcCard p={p} /></div>}
      {['biochemistry','thyroid','lft','lipid','urinalysis'].includes(type) && (
        <div className="py-2"><LabPanelTable payload={p} /></div>
      )}
      {type === 'imaging' && <div className="py-2"><ImagingCard p={p} /></div>}
      {type === 'pathology' && <div className="py-2"><PathologyCard p={p} /></div>}
      {type === 'discharge' && <div className="py-2"><DischargeCard p={p} /></div>}
      {type === 'prescription' && <div className="py-2"><PrescriptionCard p={p} /></div>}
      {type === 'operative' && <div className="py-2"><OperativeCard p={p} /></div>}
      {/* other/insurance types can be added here */}
    </div>
  );
}
