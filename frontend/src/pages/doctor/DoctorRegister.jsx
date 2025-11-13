import React, { useState } from 'react';
import api from '../../lib/api';

export default function DoctorRegister() {
    const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '', clinic_name: '', contact: '' });
    const [msg, setMsg] = useState('');

    async function onSubmit(e) {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/doctor/register', form);
            setMsg(data.message);
        } catch (e) {
            setMsg(e?.response?.data?.error || 'Error');
        }
    }

    return (
        <div className="max-w-md mx-auto card mt-20">
            <h2 className="text-xl mb-4">Doctor Registration</h2>
            <form onSubmit={onSubmit} className="space-y-3">
                {['name', 'email', 'password', 'specialization', 'clinic_name', 'contact'].map(k => (
                    <input key={k} className="input" type={k === 'password' ? 'password' : 'text'} placeholder={k} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
                ))}
                <button className="btn w-full">Submit</button>
            </form>
            {msg && <p className="mt-2">{msg}</p>}
        </div>
    );
}