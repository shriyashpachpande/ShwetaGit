import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { setToken } from '../lib/api';

export default function UploadReportPage() {
    const { appointmentId } = useParams();
    const [reports, setReports] = useState([]);
    const [file, setFile] = useState(null);
    const [isDoctor, setIsDoctor] = useState(false);
    const [pin, setPin] = useState('');

    useEffect(() => {
        const r = localStorage.getItem('role');
        setIsDoctor(r === 'doctor');
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function load() {
        try {
            if (isDoctor) {
                const t = localStorage.getItem('token');
                setToken(t);
                const { data } = await api.get(`/doctors/appointments / ${ appointmentId } / reports`);
                setReports(data.reports);
            }
        } catch (e) { }
    }

    async function upload(e) {
        e.preventDefault();
        const fd = new FormData();
        fd.append('file', file);
        const headers = {};
        if (!isDoctor) headers['X-Patient-Pin'] = pin;
        try {
            const { data } = await api.post(`/reports/upload / ${ appointmentId }`, fd, { headers });
            setReports([data.report, ...reports]);
            setFile(null);
        } catch (e) { }
    }

    function downloadUrl(r) {
        const base = (import.meta.env.VITE_API_BASE_DR_APP || 'http://localhost:5000/api').replace('/api', '');
        const headers = !isDoctor ? { 'X-Patient-Pin': pin } : {};
        // For simplicity, open link; for PIN, use fetch with headers and blob in production.
        return `${ base }/api/reports/download/${ r._id }`;
    }

    return (
        <div className="max-w-2xl mx-auto card">
            <h2 className="text-xl mb-3">Reports</h2>
            {!isDoctor && (
                <input className="input mb-3" placeholder="Enter your PIN" value={pin} onChange={e => setPin(e.target.value)} />
            )}
            <form onSubmit={upload} className="flex gap-2 mb-4">
                <input type="file" accept="application/pdf,image/*" onChange={e => setFile(e.target.files)} className="input" />
                <button className="btn">Upload</button>
            </form>
            <div className="space-y-2">
                {reports.map(r => (
                    <div key={r._id} className="border rounded-lg p-3 flex items-center justify-between">
                        <div>
                            <div className="font-medium">{r.filename}</div>
                            <div className="text-sm text-gray-600">{r.mimetype} · {(r.size / 1024).toFixed(1)} KB</div>
                        </div>
                        <a className="btn" href={downloadUrl(r)} target="_blank" rel="noreferrer">Open</a>
                    </div>
                ))}
            </div>
        </div>
    );
}