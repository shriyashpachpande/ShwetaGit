import React, { useEffect, useState } from 'react';
import api from '../lib/api';

export default function BookAppointment() {
    const [doctors, setDoctors] = useState([]);
    const [form, setForm] = useState({ doctor_id: '', patient_name: '', patient_contact: '', date: '', time_from: '', time_to: '' });
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            const { data } = await api.get('/appointments/doctors');
            setDoctors(data.doctors);
        })();
    }, []);

    async function onSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            const { data } = await api.post('/appointments/book', form);
            setResult(data);
        } catch (e) {
            setError(e?.response?.data?.error || 'Error');
        }
    }

    return (
        <div className="max-w-2xl mx-auto card mt-20">
            <h2 className="text-xl mb-4 ">Book Appointment</h2>
            <form onSubmit={onSubmit} className=" grid md:grid-cols-2 gap-3">
                <select className="input outline-0" value={form.doctor_id} onChange={e => setForm({ ...form, doctor_id: e.target.value })}>
                    <option value="">Select Doctor</option>
                    {doctors.map(d => (
                        <option key={d._id} value={d._id}>{d.name} - {d.specialization}</option>
                    ))}
                </select>
                <input className="input  outline-0" placeholder="Your Name" value={form.patient_name} onChange={e => setForm({ ...form, patient_name: e.target.value })} />
                <input className="input  outline-0" placeholder="Your Contact" value={form.patient_contact} onChange={e => setForm({ ...form, patient_contact: e.target.value })} />
                <input className="input  outline-0" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                <input className="input  outline-0" type="time" value={form.time_from} onChange={e => setForm({ ...form, time_from: e.target.value })} />
                <input className="input  outline-0" type="time" value={form.time_to} onChange={e => setForm({ ...form, time_to: e.target.value })} />
                <button className="btn col-span-full">Submit</button>
            </form>
            {error && <p className="text-red-600 mt-2">{error}</p>}
            {result && (
                <div className="mt-4 p-3 border rounded-lg ">
                    <div>Appointment ID: {result.appointment_id}</div>
                    <div className="font-semibold">Your PIN: {result.patient_pin}</div>
                    <div className="text-sm text-gray-700 mt-2">Save this PIN to chat/upload reports after doctor accepts.</div>
                </div>
            )}
        </div>
    );
}