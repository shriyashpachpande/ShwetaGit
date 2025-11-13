import { usePatientSession } from '../context/PatientSessionContext';
import PatientLogin from './PatientLogin';
import ChatPage from './ChatPage'; // Apna actual chat component import karo

export default function ProtectedPatientChatPage() {
    const { appointmentId, patientPin, logout } = usePatientSession();
    if (!appointmentId || !patientPin) return <PatientLogin />;
    return (
        <>
            <ChatPage appointmentId={appointmentId} patientPin={patientPin} />
            <button className="btn mt-4" onClick={logout}>Logout</button>
        </>
    );
}
