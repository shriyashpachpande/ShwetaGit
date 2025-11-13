import React, { useEffect, useState } from 'react';
import api, { setToken } from '../../lib/api';

export default function AdminDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);
        load();
    }, []);

    async function load() {
        const dr = await api.get('/admin/doctors/requests');
        setDoctors(dr.data.doctors);
        const ap = await api.get('/admin/appointments');
        setAppointments(ap.data.appointments);
    }

    async function approve(id) {
        await api.post(`/admin/doctors/${id}/approve`);
        load();
    }
    async function reject(id) {
        await api.post(`/admin/doctors/${id}/reject`);
        load();
    }

    return (
        <div className="grid md:grid-cols-2 gap-4 mt-20">
            <div className="card">
                <h3 className="font-semibold mb-3">Doctor Requests</h3>
                <div className="space-y-3">
                    {doctors.map(d => (
                        <div key={d._id} className="border rounded-lg p-3 flex items-center justify-between">
                            <div>
                                <div className="font-medium">{d.name} - {d.specialization}</div>
                                <div className="text-sm text-gray-600">{d.email} · {d.clinic_name} · {d.status}</div>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn" onClick={() => approve(d._id)}>Approve</button>
                                <button className="btn" onClick={() => reject(d._id)}>Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="card">
                <h3 className="font-semibold mb-3">All Appointments (read-only)</h3>
                <div className="space-y-2">
                    {appointments.map(a => (
                        <div key={a._id} className="border rounded-lg p-3">
                            <div className="font-medium">{a.patient_name} · {a.date} {a.time_from}-{a.time_to}</div>
                            <div className="text-sm text-gray-600">Doctor: {a.doctor?.name} ({a.doctor?.specialization}) · {a.status}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}