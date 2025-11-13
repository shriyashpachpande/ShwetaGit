import React, { useState } from 'react';
import api, { setToken } from '../../lib/api';

export default function AdminLogin() {
    const [email, setEmail] = useState('admin@hospital.com');
    const [password, setPassword] = useState('Admin@123');
    const [msg, setMsg] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/bootstrap-admin');
            const { data } = await api.post('/auth/login', { email, password });
            setToken(data.token);
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.user.role);
            window.location.href = '/admin/dashboard';
        } catch (e) {
            setMsg(e?.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto card mt-20">
            <h2 className="text-xl mb-4">Admin Login</h2>
            <form onSubmit={onSubmit} className="space-y-3">
                <input className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                <button className="btn w-full">Login</button>
            </form>
            {msg && <p className="text-red-600 mt-2">{msg}</p>}
        </div>
    );
}