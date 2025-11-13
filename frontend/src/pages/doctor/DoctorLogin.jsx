import React, { useState } from 'react';
import api, { setToken } from '../../lib/api';
import DoctorRegister from './DoctorRegister';

export default function DoctorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [showRegister, setShowRegister] = useState(false); // registration toggle

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      setToken(data.token);
      window.location.href = '/doctor/dashboard';
    } catch (e) {
      setMsg(e?.response?.data?.error || 'Error');
    }
  }

  return (
    <div className="max-w-md mx-auto card mt-20">
      <h2 className="text-xl mb-4">Doctor Login</h2>

      {/* Show Login Form ONLY if registration is HIDDEN */}
      {!showRegister && (
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="btn w-full">Login</button>
        </form>
      )}

      {/* Show Registration button ONLY if registration form is hidden */}
      {!showRegister && (
        <button
          className="btn w-full mt-4 bg-gray-100 text-gray-800"
          onClick={() => setShowRegister(true)}
        >
          Registration
        </button>
      )}

      {/* Show only registration form if toggled */}
      {showRegister && (
        <div className="mt-4">
          <DoctorRegister />
          <button
            className="btn w-full mt-4 bg-gray-100 text-gray-800"
            onClick={() => setShowRegister(false)}
          >
            Back to Login
          </button>
        </div>
      )}

      {msg && <p className="mt-2 text-red-600">{msg}</p>}
    </div>
  );
}
