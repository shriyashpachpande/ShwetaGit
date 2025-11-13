import React, { createContext, useContext, useState } from "react";

const PatientSessionContext = createContext();

export function PatientSessionProvider({ children }) {
  const [appointmentId, setAppointmentId] = useState(localStorage.getItem('appointment_id') || "");
  const [patientPin, setPatientPin] = useState(localStorage.getItem('patient_pin') || "");

  function login(id, pin) {
    setAppointmentId(id);
    setPatientPin(pin);
    localStorage.setItem('appointment_id', id);
    localStorage.setItem('patient_pin', pin);
  }

  function logout() {
    setAppointmentId("");
    setPatientPin("");
    localStorage.removeItem('appointment_id');
    localStorage.removeItem('patient_pin');
  }

  return (
    <PatientSessionContext.Provider value={{ appointmentId, patientPin, login, logout }}>
      {children}
    </PatientSessionContext.Provider>
  );
}

export function usePatientSession() {
  return useContext(PatientSessionContext);
}
