// import React, { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';
// import api, { setToken } from '../lib/api';

// export default function ChatPage() {
//     const { appointmentId } = useParams();
//     const [messages, setMessages] = useState([]);
//     const [msg, setMsg] = useState('');
//     const socketRef = useRef(null);
//     const [isDoctor, setIsDoctor] = useState(false);
//     const [patientPin, setPatientPin] = useState('');

//     useEffect(() => {
//         const r = localStorage.getItem('role');
//         setIsDoctor(r === 'doctor');
//     }, []);

//     async function loadHistory() {
//         try {
//             if (isDoctor) {
//                 const t = localStorage.getItem('token');
//                 setToken(t);
//                 const { data } = await api.get(`/chats/${appointmentId}`);
//                 setMessages(data.messages);
//             } else {
//                 const { data } = await api.get(`/chats/${appointmentId}/public`, { headers: { 'X-Patient-Pin': patientPin } });
//                 setMessages(data.messages);
//             }
//         } catch (e) { }
//     }

//     function connectSocket() {
//         const token = localStorage.getItem('token');
//         socketRef.current = io(import.meta.env.VITE_API_BASE?.replace('/api', '') || 'http://localhost:5000', {
//             auth: {
//                 token: isDoctor ? token : undefined,
//                 appointmentId,
//                 patientPin: isDoctor ? undefined : patientPin
//             }
//         });
//         socketRef.current.on('chat:new', (m) => setMessages((prev) => [...prev, m]));
//     }

//     const start = async () => {
//         await loadHistory();
//         connectSocket();
//     };

//     return (
//         <div className="max-w-2xl mx-auto card">
//             <h2 className="text-xl mb-3">Appointment Chat</h2>
//             {!isDoctor && (
//                 <div className="mb-3">
//                     <input className="input" placeholder="Enter your PIN" value={patientPin} onChange={e => setPatientPin(e.target.value)} />
//                     <button className="btn mt-2" onClick={start}>Join Chat</button>
//                 </div>
//             )}
//             {isDoctor && <button className="btn mb-3" onClick={start}>Join Chat</button>}
//             <div className="border rounded-lg p-3 h-80 overflow-auto bg-gray-50">
//                 {messages.map((m, i) => (
//                     <div key={i} className="mb-2">
//                         <span className="text-xs text-gray-600">{m.sender}</span>
//                         <div className="px-3 py-2 rounded-lg inline-block bg-white border shadow-md">{m.message}</div>
//                     </div>
//                 ))}
//             </div>
//             <div className="flex gap-2 mt-3">
//                 <input className="input" placeholder="Type message" value={msg} onChange={e => setMsg(e.target.value)} />
//                 <button className="btn" onClick={() => {
//                     if (!socketRef.current) return;
//                     if (!msg.trim()) return;
//                     socketRef.current.emit('chat:send', { message: msg });
//                     setMsg('');
//                 }}>Send</button>
//             </div>
//         </div>
//     );
// }










// import React, { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';
// import api, { setToken } from '../lib/api';

// function StatusAnimation({ status }) {
//     if (status === "pending")
//         return <div className="my-2 animate-bounce text-yellow-600 text-lg">⏳ Pending Approval</div>;
//     if (status === "accepted")
//         return <div className="my-2 animate-pulse text-green-700 text-lg">✅ Accepted! You may chat below.</div>;
//     if (status === "rejected")
//         return <div className="my-2 animate-pulse text-red-600 text-lg">❌ Rejected</div>;
//     return null;
// }

// export default function ChatPage() {
//     const { appointmentId } = useParams();
//     const [messages, setMessages] = useState([]);
//     const [msg, setMsg] = useState('');
//     const socketRef = useRef(null);
//     const [isDoctor, setIsDoctor] = useState(false);
//     const [patientPin, setPatientPin] = useState('');
//     const [status, setStatus] = useState('');
//     const [apptDetails, setApptDetails] = useState(null);
//     const [started, setStarted] = useState(false); // Chat started?

//     // Whether login/session is set for patients
//     useEffect(() => {
//         const r = localStorage.getItem('role');
//         setIsDoctor(r === 'doctor');
//     }, []);

//     // ------- Appointment Details & Status Fetch -------
//     useEffect(() => {
//         async function fetchDetails() {
//             try {
//                 // API endpoint should return appointment info (add in backend if not there)
//                 const apptRes = await api.get(`/appointments/${appointmentId}`);
//                 setApptDetails(apptRes.data.appointment || {});
//                 const statusRes = await api.get(`/appointments/${appointmentId}/status`);
//                 setStatus(statusRes.data.status);
//             } catch (e) {
//                 setStatus('error');
//                 setApptDetails(null);
//             }
//         }
//         fetchDetails();
//     }, [appointmentId]);

//     // --------- Load chat history and setup socket ---------
//     async function loadHistoryAndConnect() {
//         if (!isDoctor && !patientPin) return;
//         try {
//             if (isDoctor) {
//                 const t = localStorage.getItem('token');
//                 setToken(t);
//                 const { data } = await api.get(`/chats/${appointmentId}`);
//                 setMessages(data.messages);
//             } else {
//                 const { data } = await api.get(`/chats/${appointmentId}/public`, { headers: { 'X-Patient-Pin': patientPin } });
//                 setMessages(data.messages);
//             }
//             // connect socket
//             const token = localStorage.getItem('token');
//             socketRef.current = io(import.meta.env.VITE_API_BASE?.replace('/api', '') || 'http://localhost:5000', {
//                 auth: {
//                     token: isDoctor ? token : undefined,
//                     appointmentId,
//                     patientPin: isDoctor ? undefined : patientPin
//                 }
//             });
//             socketRef.current.on('chat:new', (m) => setMessages((prev) => [...prev, m]));
//             setStarted(true);
//         } catch (e) {
//             setStarted(false);
//         }
//     }
//     function InfoRow({ label, value }) {
//         return (
//             <div className="flex items-center py-2">
//                 <span className="w-32 font-medium text-gray-500">{label}:</span>
//                 <span className="ml-2 text-gray-800">{value}</span>
//             </div>
//         );
//     }

//     // --------UI--------
//     return (
//         <div className="max-w-2xl mx-auto card">
//             <h2 className="text-xl font-semibold mb-2">Appointment Chat</h2>

//             {/* Appointment Details */}
//             {apptDetails ? (

//                 <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow p-5 mb-4">
//                     <div className="flex items-center mb-4">
//                         <svg className="w-7 h-7 text-blue-500 mr-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-.828-1.343-1.5-3-1.5s-3 .672-3 1.5V12a9 9 0 006 8.485A9 9 0 0018 12v-.5c0-.828-1.343-1.5-3-1.5s-3 .672-3 1.5"></path>
//                             <circle cx="12" cy="7" r="4" />
//                         </svg>
//                         <span className="text-lg font-bold text-gray-800 tracking-wide">Appointment Details</span>
//                     </div>
//                     <div className="divide-y divide-blue-100">
//                         <InfoRow label="Doctor" value={apptDetails.doctor_name} />
//                         <InfoRow label="Patient" value={apptDetails.patient_name} />
//                         <InfoRow label="Contact" value={apptDetails.patient_contact} />
//                         <InfoRow label="Date" value={apptDetails.date} />
//                         <InfoRow label="Time from" value={apptDetails.time_from} />
//                         <InfoRow label="Time to" value={apptDetails.time_to} />
//                     </div>
//                 </div>

//             ) : (
//                 <div className="mb-2 text-red-600">Appointment details not found.</div>
//             )}

//             {/* Animated Status */}
//             <StatusAnimation status={status} />

//             {/* Chat Section */}
//             {status === "accepted" ? (
//                 <>
//                     {!started && (
//                         <div className="mb-3">
//                             {!isDoctor && (
//                                 <>
//                                     <input className="input" placeholder="Enter your PIN" value={patientPin} onChange={e => setPatientPin(e.target.value)} />
//                                     <button className="btn mt-2" onClick={loadHistoryAndConnect}>Join Chat</button>
//                                 </>
//                             )}
//                             {isDoctor && <button className="btn mb-2" onClick={loadHistoryAndConnect}>Join Chat</button>}
//                         </div>
//                     )}
//                     {started && (
//                         <>
//                             <div className="border rounded-lg p-3 h-80 overflow-auto bg-gray-50">
//                                 {messages.map((m, i) => (
//                                     <div key={i} className="mb-2">
//                                         <span className="text-xs text-gray-600">{m.sender}</span>
//                                         <div className="px-3 py-2 rounded-lg inline-block bg-white border shadow-md">{m.message}</div>
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="flex gap-2 mt-3">
//                                 <input className="input" placeholder="Type message" value={msg} onChange={e => setMsg(e.target.value)} />
//                                 <button className="btn" onClick={() => {
//                                     if (!socketRef.current) return;
//                                     if (!msg.trim()) return;
//                                     socketRef.current.emit('chat:send', { message: msg });
//                                     setMsg('');
//                                 }}>Send</button>
//                             </div>
//                         </>
//                     )}
//                 </>
//             ) : (
//                 <div className="my-4 text-gray-400 text-center">You can chat only after your appointment is accepted.</div>
//             )}
//             <button className="btn mt-4" onClick={() => {
//                 localStorage.removeItem("appointment_id");
//                 localStorage.removeItem("patient_pin");
//                 window.location.reload();
//             }}>Logout</button>
//         </div>
//     );
// }




















// import React, { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';
// import api, { setToken } from '../lib/api';

// function StatusAnimation({ status }) {
//   if (status === "pending")
//     return <div className="my-2 animate-bounce text-yellow-600 text-lg">⏳ Pending Approval</div>;
//   if (status === "accepted")
//     return <div className="my-2 animate-pulse text-green-700 text-lg">✅ Accepted! You may chat below.</div>;
//   if (status === "rejected")
//     return <div className="my-2 animate-pulse text-red-600 text-lg">❌ Rejected</div>;
//   return null;
// }

// function InfoRow({ label, value }) {
//   return (
//     <div className="flex items-center py-2">
//       <span className="w-32 font-medium text-gray-500">{label}:</span>
//       <span className="ml-2 text-gray-800">{value}</span>
//     </div>
//   );
// }

// export default function ChatPage() {
//   const { appointmentId } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [msg, setMsg] = useState('');
//   const socketRef = useRef(null);
//   const [isDoctor, setIsDoctor] = useState(false);
//   const [patientPin, setPatientPin] = useState(localStorage.getItem('patient_pin') || "");
//   const [status, setStatus] = useState('');
//   const [apptDetails, setApptDetails] = useState(null);
//   const [started, setStarted] = useState(false);

//   useEffect(() => {
//     const r = localStorage.getItem('role');
//     setIsDoctor(r === 'doctor');
//   }, []);

//   useEffect(() => {
//     async function fetchDetails() {
//       try {
//         const apptRes = await api.get(`/appointments/${appointmentId}`);
//         setApptDetails(apptRes.data.appointment || {});
//         const statusRes = await api.get(`/appointments/${appointmentId}/status`);
//         setStatus(statusRes.data.status);
//       } catch (e) {
//         setStatus('error');
//         setApptDetails(null);
//       }
//     }
//     fetchDetails();
//   }, [appointmentId]);

//   // Store patientPin in localStorage (if set)
//   useEffect(() => {
//     if (!isDoctor && patientPin) {
//       localStorage.setItem('patient_pin', patientPin);
//     }
//   }, [patientPin, isDoctor]);

//   async function loadHistoryAndConnect() {
//     if (!isDoctor && !patientPin) return;
//     try {
//       if (isDoctor) {
//         const t = localStorage.getItem('token');
//         setToken(t);
//         const { data } = await api.get(`/chats/${appointmentId}`);
//         setMessages(data.messages);
//       } else {
//         const { data } = await api.get(`/chats/${appointmentId}/public`, { headers: { 'X-Patient-Pin': patientPin } });
//         setMessages(data.messages);
//       }
//       // connect socket
//       const token = localStorage.getItem('token');
//       socketRef.current = io(import.meta.env.VITE_API_BASE?.replace('/api', '') || 'http://localhost:5000', {
//         auth: {
//           token: isDoctor ? token : undefined,
//           appointmentId,
//           patientPin: isDoctor ? undefined : patientPin
//         }
//       });
//       socketRef.current.on('chat:new', (m) => setMessages((prev) => [...prev, m]));
//       setStarted(true);
//     } catch (e) {
//       setStarted(false);
//     }
//   }

//   // Handle logout and clear session
//   function handleLogout() {
//     localStorage.removeItem("appointment_id");
//     localStorage.removeItem("patient_pin");
//     window.location.reload();
//   }

//   return (
//     <div className="max-w-2xl mx-auto card">
//       <h2 className="text-xl font-semibold mb-2">Appointment Chat</h2>

//       {/* Appointment Details */}
//       {apptDetails ? (
//         <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow p-5 mb-4">
//           <div className="flex items-center mb-4">
//             <svg className="w-7 h-7 text-blue-500 mr-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-.828-1.343-1.5-3-1.5s-3 .672-3 1.5V12a9 9 0 006 8.485A9 9 0 0018 12v-.5c0-.828-1.343-1.5-3-1.5s-3 .672-3 1.5"></path>
//               <circle cx="12" cy="7" r="4" />
//             </svg>
//             <span className="text-lg font-bold text-gray-800 tracking-wide">Appointment Details</span>
//           </div>
//           <div className="divide-y divide-blue-100">
//             <InfoRow label="Doctor" value={apptDetails.doctor_name} />
//             <InfoRow label="Patient" value={apptDetails.patient_name} />
//             <InfoRow label="Contact" value={apptDetails.patient_contact} />
//             <InfoRow label="Date" value={apptDetails.date} />
//             <InfoRow label="Time from" value={apptDetails.time_from} />
//             <InfoRow label="Time to" value={apptDetails.time_to} />
//           </div>
//         </div>
//       ) : (
//         <div className="mb-2 text-red-600">Appointment details not found.</div>
//       )}

//       {/* Animated Status */}
//       <StatusAnimation status={status} />

//       {/* Chat Section */}
//       {status === "accepted" ? (
//         <>
//           {!started && (
//             <div className="mb-3">
//               {!isDoctor && (
//                 <>
//                   <input className="input" placeholder="Enter your PIN" value={patientPin} onChange={e => setPatientPin(e.target.value)} />
//                   <button className="btn mt-2" onClick={loadHistoryAndConnect}>Join Chat</button>
//                 </>
//               )}
//               {isDoctor && <button className="btn mb-2" onClick={loadHistoryAndConnect}>Join Chat</button>}
//             </div>
//           )}
//           {started && (
//             <>
//               <div className="border rounded-lg p-3 h-80 overflow-auto bg-gray-50">
//                 {messages.map((m, i) => (
//                   <div key={i} className="mb-2">
//                     <span className={`text-xs font-bold ${m.sender === "doctor" ? "text-blue-600" : "text-green-600"}`}>
//                       {m.sender === "doctor" ? "Doctor" : "You"}
//                     </span>
//                     <div className="px-3 py-2 mt-1 rounded-lg inline-block bg-white border shadow-md">{m.message}</div>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex gap-2 mt-3">
//                 <input className="input" placeholder="Type message" value={msg} onChange={e => setMsg(e.target.value)} />
//                 <button className="btn" onClick={() => {
//                   if (!socketRef.current) return;
//                   if (!msg.trim()) return;
//                   socketRef.current.emit('chat:send', { message: msg });
//                   setMsg('');
//                 }}>Send</button>
//               </div>
//             </>
//           )}
//         </>
//       ) : (
//         <div className="my-4 text-gray-400 text-center">You can chat only after your appointment is accepted.</div>
//       )}
//       <button className="btn mt-4" onClick={handleLogout}>Logout</button>
//     </div>
//   );
// }












import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import api, { setToken } from '../lib/api';

function StatusAnimation({ status }) {
  if (status === "pending")
    return <div className="my-2 animate-bounce text-yellow-600 text-lg">⏳ Pending Approval</div>;
  if (status === "accepted")
    return <div className="my-2 animate-pulse text-green-700 text-lg">✅ Accepted! You may chat below.</div>;
  if (status === "rejected")
    return <div className="my-2 animate-pulse text-red-600 text-lg">❌ Rejected</div>;
  return null;
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center py-2">
      <span className="w-32 font-medium text-gray-500">{label}:</span>
      <span className="ml-2 text-gray-800">{value}</span>
    </div>
  );
}

export default function ChatPage() {
  const { appointmentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const socketRef = useRef(null);

  // --- fix: only set role once at start ---
  const [role, setRole] = useState("");
  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
  }, []);
  const isDoctor = role === "doctor";

  // --- critical: PIN does NOT come from localStorage for security in prod! Only state!!!
  const [patientPin, setPatientPin] = useState("");

  const [status, setStatus] = useState('');
  const [apptDetails, setApptDetails] = useState(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const apptRes = await api.get(`/appointments/${appointmentId}`);
        setApptDetails(apptRes.data.appointment || {});
        const statusRes = await api.get(`/appointments/${appointmentId}/status`);
        setStatus(statusRes.data.status);
      } catch (e) {
        setStatus('error');
        setApptDetails(null);
      }
    }
    fetchDetails();
  }, [appointmentId]);

  // Help: saves pin to localStorage for session, but only when isPatient
  useEffect(() => {
    if (!isDoctor && patientPin) {
      localStorage.setItem('patient_pin', patientPin);
    }
  }, [patientPin, isDoctor]);

  async function loadHistoryAndConnect() {
    // enforce correct role-pin logic
    if (!isDoctor && !patientPin) {
      alert("PIN Required!");
      return;
    }
    console.log("Joining with PIN:", patientPin, "| isDoctor:", isDoctor, "| appointmentId:", appointmentId);

    try {
      if (isDoctor) {
        const t = localStorage.getItem('token');
        setToken(t);
        const { data } = await api.get(`/chats/${appointmentId}`);
        setMessages(data.messages);
      } else {
        // patient: get full chat history with pin
        const { data } = await api.get(`/chats/${appointmentId}/public`, { headers: { 'X-Patient-Pin': patientPin } });
        setMessages(data.messages);
      }

      const token = localStorage.getItem('token');
      // --- pass pin only if role is patient ---
      socketRef.current = io(import.meta.env.VITE_API_BASE_DR_APP?.replace('/api', '') || 'http://localhost:5000', {
        auth: {
          token: isDoctor ? token : undefined,
          appointmentId,
          patientPin: isDoctor ? undefined : patientPin
        }
      });
      socketRef.current.on('chat:new', (m) => setMessages((prev) => [...prev, m]));
      setStarted(true);
    } catch (e) {
      setStarted(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("appointment_id");
    localStorage.removeItem("patient_pin");
    localStorage.removeItem("role");
    window.location.reload();
  }

  return (
    <div className="max-w-2xl mx-auto card">
      <h2 className="text-xl font-semibold mb-2">Appointment Chat</h2>
      {apptDetails ? (
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow p-5 mb-4">
          <div className="flex items-center mb-4">
            <svg className="w-7 h-7 text-blue-500 mr-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-.828-1.343-1.5-3-1.5s-3 .672-3 1.5V12a9 9 0 006 8.485A9 9 0 0018 12v-.5c0-.828-1.343-1.5-3-1.5s-3 .672-3 1.5"></path>
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-lg font-bold text-gray-800 tracking-wide">Appointment Details</span>
          </div>
          <div className="divide-y divide-blue-100">
            <InfoRow label="Doctor" value={apptDetails.doctor_name} />
            <InfoRow label="Patient" value={apptDetails.patient_name} />
            <InfoRow label="Contact" value={apptDetails.patient_contact} />
            <InfoRow label="Date" value={apptDetails.date} />
            <InfoRow label="Time from" value={apptDetails.time_from} />
            <InfoRow label="Time to" value={apptDetails.time_to} />
          </div>
        </div>
      ) : (
        <div className="mb-2 text-red-600">Appointment details not found.</div>
      )}
      <StatusAnimation status={status} />

      {status === "accepted" ? (
        <>
          {!started && (
            <div className="mb-3">
              {role !== "doctor" && (
                <>
                  <input
                    className="input"
                    placeholder="Enter your PIN"
                    value={patientPin}
                    onChange={e => setPatientPin(e.target.value)}
                  />
                  <button
                    className="btn mt-2"
                    disabled={!patientPin}
                    onClick={loadHistoryAndConnect}
                  >
                    Join Chat
                  </button>
                </>
              )}
              {role === "doctor" && (
                <button className="btn mb-2" onClick={loadHistoryAndConnect}>
                  Join Chat
                </button>
              )}
            </div>
          )}
          {started && (
            <>
              <div className="border rounded-lg p-3 h-80 overflow-auto bg-gray-50">
                {messages.map((m, i) => (
                  <div key={i} className="mb-2">
                    <span className={`text-xs font-bold ${m.sender === "doctor" ? "text-blue-600" : "text-green-600"}`}>
                      {m.sender === "doctor" ? "Doctor" : "You"}
                    </span>
                    <div className="px-3 py-2 mt-1 rounded-lg inline-block bg-white border shadow-md">{m.message}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  className="input"
                  placeholder="Type message"
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                />
                <button
                  className="btn"
                  onClick={() => {
                    if (!socketRef.current) return;
                    if (!msg.trim()) return;
                    socketRef.current.emit('chat:send', { message: msg });
                    setMsg('');
                  }}
                >
                  Send
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="my-4 text-gray-400 text-center">
          You can chat only after your appointment is accepted.
        </div>
      )}
      <button className="btn mt-4" onClick={handleLogout}>Logout</button>
    </div>
  );
}
