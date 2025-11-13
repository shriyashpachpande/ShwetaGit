import React, { useState } from "react";
import { usePatientSession } from "../context/PatientSessionContext";
import { useNavigate } from "react-router-dom"; // <-- Import navigate hook

export default function PatientLogin() {
  const [appointmentId, setAppointmentId] = useState("");
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");
  const { login } = usePatientSession();
  const navigate = useNavigate(); // <-- Setup navigate

  // function handleSubmit(e) {
  //   e.preventDefault();
  //   if (!appointmentId || !pin) {
  //     setMsg("Both Appointment ID and PIN are required.");
  //     return;
  //   }
  //   login(appointmentId.trim(), pin.trim());
  //   // Redirect to chat page after login:
  //   navigate(`/chat/${appointmentId.trim()}`);
  // }
  function handleSubmit(e) {
  e.preventDefault();
  if (!appointmentId || !pin) {
    setMsg("Both Appointment ID and PIN are required.");
    return;
  }
  localStorage.setItem("role", "");  // <-- IMPORTANT CHANGE! Patient mode set
  login(appointmentId.trim(), pin.trim());
  navigate(`/chat/${appointmentId.trim()}`);
}


  return (
    <div className="max-w-sm mx-auto card mt-20">
      <h2 className="text-lg font-bold mb-3">Patient Login</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          className="input"
          placeholder="Appointment ID"
          value={appointmentId}
          onChange={e => setAppointmentId(e.target.value)}
        />
        <input
          className="input"
          placeholder="PIN"
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
        />
        <button className="btn w-full mt-2" type="submit">Login</button>
      </form>
      {msg && <div className="text-red-600 mt-2">{msg}</div>}
    </div>
  );
}
