import React, { useEffect, useState } from 'react';
import api, { setToken } from '../../lib/api';
import { Link } from 'react-router-dom';

export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const t = localStorage.getItem('token');
        setToken(t);
        load();
    }, []);

    async function load() {
        const { data } = await api.get('/doctors/appointments');
        setAppointments(data.appointments);
    }

    async function setStatus(id, status) {
        await api.post(`/doctors/appointments/${id}/status`, { status });
        load();
    }

    return (
        <div className="grid lg:grid-cols-2 gap-4 mt-20">
            <div className="card">
                <h3 className="font-semibold mb-3">My Appointments</h3>
                <div className="space-y-2">
                    {appointments.map(a => (
                        <div key={a._id} className="border rounded-lg p-3">
                            <div className="font-medium">{a.patient_name} · {a.date} {a.time_from}-{a.time_to} · {a.status}</div>
                            <div className="flex gap-2 mt-2">
                                {a.status === 'pending' && (
                                    <>
                                        <button className="btn" onClick={() => setStatus(a._id, 'accepted')}>Accept</button>
                                        <button className="btn" onClick={() => setStatus(a._id, 'rejected')}>Reject</button>
                                    </>
                                )}
                                {a.status === 'accepted' && (
                                    <>
                                        <Link className="btn" to={`/chat/${a._id}`}>Open Chat</Link>
                                        <Link className="btn" to={`/upload-report/${a._id}`}>View/Upload Reports</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="card">
                <h3 className="font-semibold mb-3">Instructions</h3>
                <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                    <li>Accept to enable chat and report sharing.</li>
                    <li>Patients join using their appointment PIN.</li>
                </ul>
            </div>
        </div>
    );
}